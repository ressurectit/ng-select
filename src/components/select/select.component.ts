import {Component, ChangeDetectionStrategy, Input, viewChild, ViewContainerRef, Signal, WritableSignal, signal, Inject, Optional, Type, resolveForwardRef, FactoryProvider, effect, forwardRef, Attribute, ElementRef, computed} from '@angular/core';
import {isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, PluginDescription, Popup, Positioner, ReadonlyState, SelectApi, SelectCssClasses, SelectOptions, SelectPlugin, ValueHandler} from '../../interfaces';
import {INTERACTIONS_TYPE, KEYBOARD_HANDLER_TYPE, LIVE_SEARCH_TYPE, NORMAL_STATE_TYPE, OPTIONS_HANDLER_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, SELECT_OPTIONS, VALUE_HANDLER_TYPE} from '../../misc/tokens';
import {SelectPluginType} from '../../misc/enums';
import {SelectBus, SelectPluginInstances} from '../../misc/classes';
import {BasicPositionerComponent, BasicValueHandlerComponent, NoInteractionsComponent, NoLiveSearchComponent, NoOptionsHandlerComponent, SimpleKeyboardHandlerComponent, SimpleNormalStateComponent, SimplePopupComponent} from '../../plugins';
import {CopyOptionsAsSignal} from '../../decorators';

//TODO - dynamic change of absolute popup
//TODO - dynamic change of options gatherer destroy called properly ?

/**
 * Default 'SelectOptions'
 */
const defaultOptions: Omit<SelectOptions, 'optionsGatherer'|'templateGatherer'> =
{
    autoInitialize: true,
    absolute: false,
    multiple: false,
    readonly: false,
    containerElement: null,
    // valueComparer: (source, target) =>
    // {
    //     return source === target;
    // },
    // liveSearchFilter: (query: string, normalizer: NormalizeFunc = value => value) =>
    // {
    //     return itm => normalizer(itm.text).indexOf(normalizer(query)) >= 0;
    // },
    // normalizer: value =>
    // {
    //     if(isString(value))
    //     {
    //         return value.toLowerCase();
    //     }

    //     return value;
    // },
    cssClasses:
    {
    },
    plugins:
    {
        interactions: <PluginDescription<Interactions>>
        {
            type: forwardRef(() => NoInteractionsComponent),
        },
        keyboardHandler: <PluginDescription<KeyboardHandler>>
        {
            type: forwardRef(() => SimpleKeyboardHandlerComponent),
        },
        liveSearch: <PluginDescription<LiveSearch>>
        {
            type: forwardRef(() => NoLiveSearchComponent),
        },
        normalState: <PluginDescription<NormalState>>
        {
            type: forwardRef(() => SimpleNormalStateComponent),
        },
        optionsHandler: <PluginDescription<OptionsHandler>>
        {
            type: forwardRef(() => NoOptionsHandlerComponent),
        },
        popup: <PluginDescription<Popup>>
        {
            type: forwardRef(() => SimplePopupComponent),
        },
        positioner: <PluginDescription<Positioner>>
        {
            type: forwardRef(() => BasicPositionerComponent),
        },
        readonlyState: <PluginDescription<ReadonlyState>>
        {
            type: forwardRef(() => SimpleNormalStateComponent),
        },
        valueHandler: <PluginDescription<ValueHandler>>
        {
            type: forwardRef(() => BasicValueHandlerComponent),
        },
    },
};

/**
 * Component that represents Select itself, allows selection of value from options
 */
@Component(
{
    selector: 'ng-select',
    templateUrl: 'select.component.html',
    styleUrl: 'select.component.css',
    providers:
    [
        <FactoryProvider>
        {
            provide: SelectPluginInstances,
            useFactory: () => new SelectPluginInstances(),
        },
        SelectBus,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select<TValue = unknown, TCssClasses = SelectCssClasses> implements SelectApi<TValue, TCssClasses>
{
    //######################### protected fields #########################

    /**
     * Object storing current used plugin type
     */
    protected pluginTypes: Record<SelectPluginType, Type<SelectPlugin>|undefined|null> =
    {
        Interactions: null,
        KeyboardHandler: null,
        LiveSearch: null,
        NormalState: null,
        OptionsHandler: null,
        Popup: null,
        Positioner: null,
        ReadonlyState: null,
        ValueHandler: null,
    };

    /**
     * Subject that holds init state of live search plugin
     */
    protected liveSearchInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of interactions plugin
     */
    protected interactionsInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of options handler plugin
     */
    protected optionsHandlerInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of positioner plugin
     */
    protected positionerInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of keyboard plugin
     */
    protected keyboardInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of value handler plugin
     */
    protected valueHandlerInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of readonly state plugin
     */
    protected readonlyStateInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of normal state plugin
     */
    protected normalStateInit: WritableSignal<boolean> = signal(false);

    /**
     * Subject that holds init state of popup plugin
     */
    protected popupInit: WritableSignal<boolean> = signal(false);

    // /**
    //  * Subject used for indication that Select was initialized
    //  */
    // protected _initializedSubject: WritableSignal<boolean> = signal(false);

    // /**
    //  * Occurs when array of provided options has changed
    //  */
    // protected _optionsChange: EventEmitter<void> = new EventEmitter<void>();

    // /**
    //  * Occurs when array of visible, displayed options has changed
    //  */
    // protected _availableOptionsChange: EventEmitter<void> = new EventEmitter<void>();

    // /**
    //  * Array of available options to be displayed
    //  */
    // protected _availableOptions: SelectOption<TValue>[] = [];

    // /**
    //  * Live search plugin currently used in Select
    //  */
    // protected _liveSearch: LiveSearch;

    // /**
    //  * Subscription for changes of live search value
    //  */
    // protected _searchValueChangeSubscription: Subscription;

    // /**
    //  * Instance of component ref for absolute popup
    //  */
    // protected _absolutePopup: ComponentRef<Popup>;

    // /**
    //  * Instance of type that is used as absolute popup
    //  */
    // protected _absolutePopupType: Type<Popup>;

    // /**
    //  * Instance of html element that is used
    //  */
    // protected _absolutePopupElement: HTMLElement;

    //######################### protected properties - children #########################

    /**
     * Container used for rendering live search plugin
     */
    protected liveSearchContainer: Signal<ViewContainerRef> = viewChild.required('liveSearch', {read: ViewContainerRef});

    /**
     * Container used for rendering interactions plugin
     */
    protected interactionsContainer: Signal<ViewContainerRef> = viewChild.required('interactions', {read: ViewContainerRef});

    /**
     * Container used for rendering options handler plugin
     */
    protected optionsHandlerContainer: Signal<ViewContainerRef> = viewChild.required('optionsHandler', {read: ViewContainerRef});

    /**
     * Container used for rendering positioner plugin
     */
    protected positionerContainer: Signal<ViewContainerRef> = viewChild.required('positioner', {read: ViewContainerRef});

    /**
     * Container used for rendering keyboard handler plugin
     */
    protected keyboardHandlerContainer: Signal<ViewContainerRef> = viewChild.required('keyboardHandler', {read: ViewContainerRef});

    /**
     * Container used for rendering value handler plugin
     */
    protected valueHandlerContainer: Signal<ViewContainerRef> = viewChild.required('valueHandler', {read: ViewContainerRef});

    /**
     * Container used for rendering readonly state plugin
     */
    protected readonlyStateContainer: Signal<ViewContainerRef> = viewChild.required('readonlyState', {read: ViewContainerRef});

    /**
     * Container used for rendering normal state plugin
     */
    protected normalStateContainer: Signal<ViewContainerRef> = viewChild.required('normalState', {read: ViewContainerRef});

    /**
     * Container used for rendering popup plugin
     */
    protected popupContainer: Signal<ViewContainerRef> = viewChild.required('popup', {read: ViewContainerRef});

    // //######################### public properties - inputs #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    @Input()
    public selectOptions: SelectOptions<TValue, TCssClasses>;

    // /**
    //  * Indication whether should be Select disabled or not
    //  */
    // public disabled: InputSignal<boolean> = input(false);

    // /**
    //  * Indication whether should be Select readonly or not
    //  */
    // public readonly: InputSignal<boolean> = input(false);

    // //######################### public properties - implementation of Select #########################

    // /**
    //  * Occurs every time when Select is initialized or reinitialized, if value is false Select was not initialized yet
    //  */
    // public get initialized(): Observable<boolean>
    // {
    //     return this._initializedSubject.asObservable();
    // }

    // /**
    //  * Gets current state of initialization
    //  */
    // public isInitialized: boolean = false;

    // //######################### public properties - implementation of TemplateGatherer #########################

    // /**
    //  * Template used within normal state
    //  */
    // @ContentChild('normalStateTemplate')
    // public normalStateTemplate: TemplateRef<NormalStateContext>;

    // /**
    //  * Template that is used within Popup as option
    //  * @internal
    //  */
    // @ContentChild('optionTemplate')
    // public optionTemplate?: TemplateRef<PopupContext>;

    // //######################### public properties - implementation of OptionsGatherer #########################

    // /**
    //  * Array of provided options for select
    //  */
    // public get options(): SelectOption<TValue>[]
    // {
    //     return this.optionsChildren.toArray();
    // }

    // /**
    //  * Occurs when array of provided options has changed
    //  */
    // public get optionsChange(): EventEmitter<void>
    // {
    //     return this._optionsChange;
    // }

    // /**
    //  * Array of visible, displayed options for select
    //  */
    // public get availableOptions(): SelectOption<TValue>[]
    // {
    //     return this._availableOptions;
    // }

    // /**
    //  * Occurs when array of visible, displayed options has changed
    //  */
    // public get availableOptionsChange(): EventEmitter<void>
    // {
    //     return this._availableOptionsChange;
    // }

    // /**
    //  * Select plugin instances available for gatherer
    //  */
    // public SelectPlugins: SelectPluginInstances;

    // /**
    //  * Plugin bus used for inter plugin shared events
    //  */
    // public pluginBus: PluginBus<TValue>;

    // /**
    //  * Select element that implements default gatherers
    //  */
    // public select: Select<TValue>;

    // //######################### public properties - template bindings #########################

    // /**
    //  * Element used for live search
    //  */
    // public liveSearchElement: HTMLElement[][];

    // //######################### public properties - children #########################

    // /**
    //  * Options children found inside ng-select
    //  */
    // @ContentChildren(OptionComponent)
    // public optionsChildren: QueryList<SelectOption>;

    // //######################### public properties - children #########################

    // /**
    //  * Options groups children found inside ng-select
    //  */
    // @ContentChildren(OptGroupComponent)
    // public optGroupsChildren: QueryList<SelectOptGroup>;

    //######################### constructors #########################
    constructor(protected pluginInstances: SelectPluginInstances,
                protected bus: SelectBus<TValue>,
                element: ElementRef<HTMLElement>,
                @Attribute('readonly') readonly?: string|null,
                @Attribute('disabled') disabled?: string|null,
                @Attribute('multiple') multiple?: string|null,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState>|null,
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler>|null,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>|null,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>|null,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>|null,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler>|null,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>|null,
                @Inject(INTERACTIONS_TYPE) @Optional() interactionsType?: Type<Interactions>|null,
                @Inject(OPTIONS_HANDLER_TYPE) @Optional() optionsHandlerType?: Type<OptionsHandler>|null,
                @Inject(SELECT_OPTIONS) @Optional() options?: RecursivePartial<SelectOptions<TValue, TCssClasses>>|null,)
    {
        //at least on of following is present (value is not important)
        const readonlyDefault = isPresent(readonly) || isPresent(disabled);
        const multipleDefault = isPresent(multiple);
        const opts: RecursivePartial<SelectOptions<TValue, TCssClasses>> = deepCopyWithArrayOverride({}, options);

        opts.plugins ??= {};

        if(keyboardHandlerType)
        {
            opts.plugins.keyboardHandler ??= {};
            opts.plugins.keyboardHandler.type = keyboardHandlerType;
        }

        if(normalStateType)
        {
            opts.plugins.normalState ??= {};
            opts.plugins.normalState.type = normalStateType;
        }

        if(popupType)
        {
            opts.plugins.popup ??= {};
            opts.plugins.popup.type = popupType;
        }

        if(positionerType)
        {
            opts.plugins.positioner ??= {};
            opts.plugins.positioner.type = positionerType;
        }

        if(readonlyStateType)
        {
            opts.plugins.readonlyState ??= {};
            opts.plugins.readonlyState.type = readonlyStateType;
        }

        if(valueHandlerType)
        {
            opts.plugins.valueHandler ??= {};
            opts.plugins.valueHandler.type = valueHandlerType;
        }

        if(liveSearchType)
        {
            opts.plugins.liveSearch ??= {};
            opts.plugins.liveSearch.type = liveSearchType;
        }

        if(interactionsType)
        {
            opts.plugins.interactions ??= {};
            opts.plugins.interactions.type = interactionsType;
        }

        if(optionsHandlerType)
        {
            opts.plugins.optionsHandler ??= {};
            opts.plugins.optionsHandler.type = optionsHandlerType;
        }

        this.selectOptions = deepCopyWithArrayOverride(
            <RecursivePartial<SelectOptions<TValue, TCssClasses>>>
            {
                optionsGatherer: this,
                templateGatherer: this,
            },
            defaultOptions as SelectOptions<TValue, TCssClasses>,
            <RecursivePartial<SelectOptions<TValue>>>
            {
                readonly: readonlyDefault,
                multiple: multipleDefault,
            },
            opts);

        bus.selectElement.set(element);
        bus.selectOptions = computed(() => this.selectOptions);

        effect(async () =>
        {
            const selectOptions = this.selectOptions;
            const liveSearchContainer = this.liveSearchContainer();
            const interactionsContainer = this.interactionsContainer();
            const optionsHandlerContainer = this.optionsHandlerContainer();
            const positionerContainer = this.positionerContainer();
            const keyboardHandlerContainer = this.keyboardHandlerContainer();
            const valueHandlerContainer = this.valueHandlerContainer();

            await this.createPlugin(selectOptions.plugins?.liveSearch, SelectPluginType.LiveSearch, liveSearchContainer, this.liveSearchInit);
            await this.createPlugin(selectOptions.plugins?.interactions, SelectPluginType.Interactions, interactionsContainer, this.interactionsInit);
            await this.createPlugin(selectOptions.plugins?.optionsHandler, SelectPluginType.OptionsHandler, optionsHandlerContainer, this.optionsHandlerInit);
            await this.createPlugin(selectOptions.plugins?.positioner, SelectPluginType.Positioner, positionerContainer, this.positionerInit);
            await this.createPlugin(selectOptions.plugins?.keyboardHandler, SelectPluginType.KeyboardHandler, keyboardHandlerContainer, this.keyboardInit);
            await this.createPlugin(selectOptions.plugins?.valueHandler, SelectPluginType.ValueHandler, valueHandlerContainer, this.valueHandlerInit);
        });

        effect(() =>
        {
            const readonlyStateContainer = this.readonlyStateContainer();
            const normalStateContainer = this.normalStateContainer();
            const selectOptions = this.selectOptions;

            if(selectOptions.readonly)
            {
                this.destroyPlugin(SelectPluginType.NormalState, normalStateContainer, this.normalStateInit);
                this.normalStateInit.set(true);
                this.createPlugin(this.selectOptions.plugins?.readonlyState, SelectPluginType.ReadonlyState, readonlyStateContainer, this.readonlyStateInit);
            }
            else
            {
                this.destroyPlugin(SelectPluginType.ReadonlyState, readonlyStateContainer, this.readonlyStateInit);
                this.readonlyStateInit.set(true);
                this.createPlugin(this.selectOptions.plugins?.normalState, SelectPluginType.NormalState, normalStateContainer, this.normalStateInit);
            }
        });

        effect(() =>
        {
            const selectOptions = this.selectOptions;
            const popupContainer = this.popupContainer();

            this.destroyPlugin(SelectPluginType.Popup, popupContainer, this.popupInit);
            this.createPlugin(this.selectOptions.plugins?.popup, SelectPluginType.Popup, this.popupContainer(), this.popupInit);

            if(selectOptions.absolute)
            {
                //TODO: position absolute popup properly
            }
        });
    }

    // //######################### public methods - implementation of OnChanges #########################

    // /**
    //  * Called when input value changes
    //  */
    // public ngOnChanges(changes: SimpleChanges): void
    // {
    //     const updateReadonly = (state: boolean, firstChange: boolean) =>
    //     {
    //         //update options
    //         this.selectOptions.readonly = state;

    //         if(!firstChange)
    //         {
    //             this.initOptions();
    //             this.initialize();
    //         }
    //     };

    //     if(nameof<SelectComponent<TValue>>('disabled') in changes && isBoolean(this.disabled))
    //     {
    //         updateReadonly(this.disabled, changes[nameof<SelectComponent<TValue>>('disabled')].firstChange);
    //     }

    //     if(nameof<SelectComponent<TValue>>('readonly') in changes && isBoolean(this.readonly))
    //     {
    //         updateReadonly(this.readonly, changes[nameof<SelectComponent<TValue>>('readonly')].firstChange);
    //     }
    // }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        // this.initOptions();
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        // this._availableOptions = this.options;

        // this.optionsChildren.changes.subscribe(() =>
        // {
        //     this._availableOptions = this.options;
        //     this._optionsChange.emit();
        //     this._availableOptionsChange.emit();
        // });

        // if(this._selectOptions.autoInitialize)
        // {
        //     this.initialize();
        // }
    }

    // //######################### public methods - implementation of OnDestroy #########################

    // /**
    //  * Called when component is destroyed
    //  */
    // public ngOnDestroy()
    // {
    //     this._searchValueChangeSubscription?.unsubscribe();
    //     this._searchValueChangeSubscription = null;

    //     this.selectOptions.optionsGatherer?.destroyGatherer();

    //     this._destroyAbsolutePopup();
    // }

    // //######################### public methods - implementation of OptionsGatherer #########################

    // /**
    //  * Initialize gatherer during initialization phase
    //  */
    // public initializeGatherer(): void
    // {
    //     const liveSearch = this._pluginInstances[LIVE_SEARCH] as LiveSearch;

    //     if(this._liveSearch && this._liveSearch != liveSearch)
    //     {
    //         this._searchValueChangeSubscription.unsubscribe();
    //         this._searchValueChangeSubscription = null;

    //         this._liveSearch = null;
    //     }

    //     if(!this._liveSearch)
    //     {
    //         this._liveSearch = liveSearch;

    //         this._searchValueChangeSubscription = this._liveSearch.searchValueChange.subscribe(() =>
    //         {
    //             if(!this._liveSearch.searchValue)
    //             {
    //                 this._availableOptions = this.options;
    //                 this._availableOptionsChange.emit();

    //                 return;
    //             }

    //             this._availableOptions = this.options.filter(this.selectOptions.liveSearchFilter(this._liveSearch.searchValue, this.selectOptions.normalizer));
    //             this._availableOptionsChange.emit();
    //         });
    //     }
    // }

    // /**
    //  * Called when gatherer needs to be destroyed
    //  */
    // public destroyGatherer(): void
    // {
    // }

    // //######################### public methods - template bindings #########################

    // /**
    //  * Sets normal state component
    //  * @param normalState - Created normal state that is rendered
    //  * @internal
    //  */
    // public setNormalStateComponent(normalState: NormalState)
    // {
    //     this._registerNewPlugin(normalState, NORMAL_STATE, 'normalState');
    // }

    // /**
    //  * Sets keyboard handler component
    //  * @param keyboardHandler - Created keyboard handler that is rendered
    //  * @internal
    //  */
    // public setKeyboardHandlerComponent(keyboardHandler: KeyboardHandler)
    // {
    //     this._registerNewPlugin(keyboardHandler, KEYBOARD_HANDLER, 'keyboardHandler');
    // }

    // /**
    //  * Sets popup component
    //  * @param popup - Created popup that is rendered
    //  * @internal
    //  */
    // public setPopupComponent(popup: Popup)
    // {
    //     this._registerNewPlugin(popup, POPUP, 'popup');
    // }

    // /**
    //  * Sets positioner component
    //  * @param positioner - Created positioner that is rendered
    //  * @internal
    //  */
    // public setPositionerComponent(positioner: Positioner)
    // {
    //     this._registerNewPlugin(positioner, POSITIONER, 'positioner');
    // }

    // /**
    //  * Sets readonly state component
    //  * @param readonlyState - Created readonly state that is rendered
    //  * @internal
    //  */
    // public setReadonlyStateComponent(readonlyState: ReadonlyState)
    // {
    //     this._registerNewPlugin(readonlyState, READONLY_STATE, 'readonlyState');
    //     this._pluginInstances[NORMAL_STATE] = this._pluginInstances[READONLY_STATE];
    // }

    // /**
    //  * Sets value handler component
    //  * @param valueHandler - Created value handler that is rendered
    //  * @internal
    //  */
    // public setValueHandlerComponent(valueHandler: ValueHandler<TValue>)
    // {
    //     this._registerNewPlugin(valueHandler, VALUE_HANDLER, 'valueHandler');
    // }

    // /**
    //  * Sets live search component
    //  * @param liveSearch - Created live search that is rendered
    //  * @internal
    //  */
    // public setLiveSearchComponent(liveSearch: LiveSearch)
    // {
    //     this._registerNewPlugin(liveSearch, LIVE_SEARCH, 'liveSearch');
    // }

    // //######################### public methods #########################

    // /**
    //  * Initialize component, automatically called once if not blocked by options
    //  */
    // public initialize()
    // {
    //     const liveSearchPlugin = this._pluginInstances[LIVE_SEARCH] as LiveSearch;
    //     this.liveSearchElement = [[liveSearchPlugin.liveSearchElement]];

    //     if(this.selectOptions.absolute)
    //     {
    //         this._appendPopupToBody(this._selectOptions.plugins.popup.type);
    //     }

    //     this._changeDetector.detectChanges();

    //     this.selectOptions.optionsGatherer.initializeGatherer();

    //     this._pluginInstances[LIVE_SEARCH].initialize();
    //     this._pluginInstances[KEYBOARD_HANDLER].initialize();
    //     this._pluginInstances[VALUE_HANDLER].initialize();
    //     this._pluginInstances[NORMAL_STATE]?.initialize();
    //     this._pluginInstances[READONLY_STATE]?.initialize();
    //     this._pluginInstances[POPUP].initialize();
    //     this._pluginInstances[POSITIONER].initialize();

    //     this.isInitialized = true;
    //     this._initializedSubject.next(true);
    // }

    // /**
    //  * Initialize options, automaticaly called during init phase, but can be used to reinitialize SelectOptions
    //  */
    // public initOptions()
    // {
    //     this.selectOptions.optionsGatherer.SelectPlugins = this._pluginInstances;
    //     this.selectOptions.optionsGatherer.pluginBus = this._pluginBus;
    //     this.selectOptions.optionsGatherer.select = this;

    //     const initOptionsPlugin = (pluginKey: string, pluginName: keyof SelectPluginTypes) =>
    //     {
    //         if(this._selectOptions.plugins[pluginName])
    //         {
    //             this._selectOptions.plugins[pluginName].type = resolveForwardRef(this._selectOptions.plugins[pluginName].type);

    //             if(this._pluginInstances[pluginKey])
    //             {
    //                 if(this._selectOptions.plugins && this._selectOptions.plugins[pluginName] && this._selectOptions.plugins[pluginName].options)
    //                 {
    //                     this._pluginInstances[pluginKey].options = this._selectOptions.plugins[pluginName].options;
    //                 }

    //                 this._pluginInstances[pluginKey].initOptions();
    //             }
    //         }
    //     };

    //     if(this._selectOptions.plugins)
    //     {
    //         initOptionsPlugin(NORMAL_STATE, 'normalState');
    //         initOptionsPlugin(KEYBOARD_HANDLER, 'keyboardHandler');
    //         initOptionsPlugin(POPUP, 'popup');
    //         initOptionsPlugin(POSITIONER, 'positioner');
    //         initOptionsPlugin(READONLY_STATE, 'readonlyState');
    //         initOptionsPlugin(VALUE_HANDLER, 'valueHandler');
    //         initOptionsPlugin(LIVE_SEARCH, 'liveSearch');
    //     }
    // }

    // /**
    //  * Gets instance of plugin by its id
    //  * @param pluginId - Id of plugin, use constants
    //  */
    // public getPlugin<PluginType extends SelectPlugin>(pluginId: string): PluginType
    // {
    //     return this._pluginInstances[pluginId] as PluginType;
    // }

    // /**
    //  * Subscribes for event
    //  * @param eventName - Name of event that should be listened to
    //  * @param handler - Function used for handling event
    //  */
    // public listenTo<TParam = void>(eventName: keyof PluginBusEvents, handler: (data: TParam) => void): Subscription
    // {
    //     return this._pluginBus[eventName].subscribe(handler);
    // }

    // /**
    //  * Executes actions on Select
    //  * @param actions - Array of actions that are executed over Select
    //  */
    // public execute(...actions: SelectAction<TValue>[])
    // {
    //     if(!actions)
    //     {
    //         return;
    //     }

    //     actions.forEach(action => action(this));
    // }

    // /**
    //  * Executes function on Select and returns result
    //  * @param func - Function that is executed and its result is returned
    //  */
    // public executeAndReturn<TResult>(func: SelectFunction<TResult, TValue>): TResult
    // {
    //     if(!func)
    //     {
    //         return null;
    //     }

    //     return func(this);
    // }

    // //######################### protected methods #########################

    // /**
    //  * Appends popup component directly to body, allows absolute positioning over page body
    //  * @param component - Popup component type to be appended
    //  */
    // protected _appendPopupToBody(component: Type<Popup>)
    // {
    //     //do not reinitialize if already exists and nothing has changed
    //     if(this._absolutePopupType == component && this.liveSearchElement[0][0] == this._absolutePopupElement)
    //     {
    //         return;
    //     }

    //     // 0. Destroyes absolute popup if it exists
    //     this._destroyAbsolutePopup();

    //     if(!component)
    //     {
    //         return;
    //     }

    //     this._absolutePopupType = component;
    //     this._absolutePopupElement = this.liveSearchElement[0][0];

    //     // 1. Create a component reference from the component
    //     this._absolutePopup = this._componentFactoryResolver
    //         .resolveComponentFactory(component)
    //         .create(this._injector, this.liveSearchElement);

    //     // 2. Attach component to the appRef so that it's inside the ng component tree
    //     this._appRef.attachView(this._absolutePopup.hostView);

    //     // 3. Get DOM element from component
    //     const domElem = (this._absolutePopup.hostView as EmbeddedViewRef<any>)
    //         .rootNodes[0] as HTMLElement;

    //     // 4. Append DOM element to the body
    //     renderToBody(document, domElem, this._selectOptions.containerElement);

    //     this.setPopupComponent(this._absolutePopup.instance);
    // }

    // /**
    //  * Destroyes absolute popup if it exists
    //  */
    // protected _destroyAbsolutePopup()
    // {
    //     if(this._absolutePopup)
    //     {
    //         this._appRef.detachView(this._absolutePopup.hostView);
    //         this._absolutePopup.destroy();
    //         this._absolutePopup = null;
    //         this._absolutePopupType = null;
    //         this._absolutePopupElement = null;
    //     }
    // }

    /**
     * Creates plugin
     * @param pluginDescription - Information about plugin that should be created
     * @param pluginType - Key of plugin used for pluginInstances
     * @param pluginViewContainer - Container where should be plugin created
     * @param initOptions - Signal that hold information about init options state for this plugin
     */
    protected async createPlugin<TPlugin extends SelectPlugin>(pluginDescription: PluginDescription<TPlugin>|undefined|null,
                                                               pluginType: SelectPluginType,
                                                               pluginViewContainer: ViewContainerRef,
                                                               initOptions: WritableSignal<boolean>,): Promise<void>
    {
        if(!pluginDescription?.type)
        {
            this.destroyPlugin(pluginType, pluginViewContainer, initOptions);

            return;
        }

        const type = resolveForwardRef(pluginDescription.type);
        let newInstance = false;

        //new type provided
        if(type != this.pluginTypes[pluginType])
        {
            initOptions.set(false);
            this.pluginTypes[pluginType] = type;
            pluginViewContainer.clear();

            const component = pluginViewContainer.createComponent(type);
            component.changeDetectorRef.detectChanges();
            this.pluginInstances[pluginType] = component.instance;
            newInstance = true;
        }

        //only call when new instance of plugin was created
        if(newInstance)
        {
            pluginDescription.instanceCallback?.(this.pluginInstances[pluginType] as TPlugin);
        }

        //options are available, set them
        if(pluginDescription.options)
        {
            initOptions.set(false);
            this.pluginInstances[pluginType].options = pluginDescription.options;
        }

        await this.initOption(pluginType, initOptions);
    }

    /**
     * Init options for single plugin
     * @param pluginType - Type of plugin to be initialized
     * @param initOptions - Init options signal for this plugin
     */
    protected async initOption(pluginType: SelectPluginType,
                               initOptions: WritableSignal<boolean>,): Promise<void>
    {
        await this.pluginInstances[pluginType].initOptions();
        initOptions.set(true);
    }

    /**
     * Destroys plugin
     * @param pluginType - Plugin type to be destroyed
     * @param plugiViewContainer - Container which will be emptied
     * @param initOptions - Signal that hold information about init options state for this plugin
     */
    protected destroyPlugin(pluginType: SelectPluginType,
                            pluginViewContainer: ViewContainerRef,
                            initOptions: WritableSignal<boolean>,): void
    {
        pluginViewContainer.clear();
        initOptions.set(false);
        this.pluginTypes[pluginType] = null;
    }
}
