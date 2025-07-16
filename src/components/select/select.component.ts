import {Component, ChangeDetectionStrategy, Input, viewChild, ViewContainerRef, Signal, WritableSignal, signal, Inject, Optional, ChangeDetectorRef, Type, resolveForwardRef, FactoryProvider, effect} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {PluginDescription, SelectOptions, SelectPlugin} from '../../interfaces';
import {SELECT_OPTIONS} from '../../misc/tokens';
import {SelectPluginType} from '../../misc/enums';
import {SelectPluginInstances} from '../../misc/classes';

//TODO - dynamic change of absolute popup
//TODO - dynamic change of options gatherer destroy called properly ?

/**
 * Default 'SelectOptions'
 * @internal
 */
const defaultOptions: SelectOptions =
{
    autoInitialize: true,
    absolute: false,
    forceValueCheckOnInit: false,
    multiple: false,
    readonly: false,
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
    // plugins:
    // {
    //     normalState: <PluginDescription<BasicNormalStateComponent>>
    //     {
    //         type: forwardRef(() => BasicNormalStateComponent),
    //     },
    //     liveSearch: <PluginDescription<NoLiveSearchComponent>>
    //     {
    //         type: forwardRef(() => NoLiveSearchComponent),
    //     },
    //     popup: <PluginDescription<BasicPopupComponent>>
    //     {
    //         type: forwardRef(() => BasicPopupComponent),
    //     },
    //     positioner: <PluginDescription<DefaultPositionerComponent>>
    //     {
    //         type: forwardRef(() => DefaultPositionerComponent),
    //     },
    //     keyboardHandler: <PluginDescription<BasicKeyboardHandlerComponent>>
    //     {
    //         type: forwardRef(() => BasicKeyboardHandlerComponent),
    //     },
    //     readonlyState: <PluginDescription<ReadonlyState>>
    //     {
    //         type: forwardRef(() => BasicNormalStateComponent),
    //     },
    //     valueHandler: <PluginDescription<BasicValueHandlerComponent>>
    //     {
    //         type: forwardRef(() => BasicValueHandlerComponent),
    //     },
    // },
};

/**
 * Component that represents Select itself, allows selection of value from options
 */
@Component(
{
    selector: 'ng-select',
    templateUrl: 'select.component.html',
    styles:
    `:host
    {
        display: block;
        position: relative;
    }`,
    providers:
    [
        <FactoryProvider>
        {
            provide: SelectPluginInstances,
            useFactory: () => {return new SelectPluginInstances();},
        },
        // <ClassProvider>
        // {
        //     provide: PluginBus,
        //     useClass: PluginBus,
        // },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<TValue = unknown>
{
    //######################### protected fields #########################

    /**
     * Select options as signal
     */
    protected selectOptionsSignal: WritableSignal<SelectOptions<TValue>>;

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

    // /**
    //  * Subject used for indication that Select was initialized
    //  */
    // protected _initializedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    protected readonlyStateContainer: Signal<ViewContainerRef|undefined|null> = viewChild('readonlyState', {read: ViewContainerRef});

    /**
     * Container used for rendering normal state plugin
     */
    protected normalStateContainer: Signal<ViewContainerRef|undefined|null> = viewChild('normalState', {read: ViewContainerRef});

    /**
     * Container used for rendering popup plugin
     */
    protected popupContainer: Signal<ViewContainerRef|undefined|null> = viewChild('popup', {read: ViewContainerRef});

    // //######################### public properties - inputs #########################

    /**
     * Gets or sets Select options
     */
    @Input()
    public get selectOptions(): SelectOptions<TValue>
    {
        return this.selectOptionsSignal();
    }
    public set selectOptions(options: RecursivePartial<SelectOptions<TValue>>)
    {
        this.selectOptionsSignal.set(deepCopyWithArrayOverride({}, this.selectOptionsSignal(), options));
        // this._pluginBus.selectOptions = this._selectOptions;
    }

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
    constructor(protected changeDetector: ChangeDetectorRef,
                protected pluginInstances: SelectPluginInstances,
                @Inject(SELECT_OPTIONS) @Optional() options?: RecursivePartial<SelectOptions<TValue>>,)
    {
        this.selectOptionsSignal = signal((deepCopyWithArrayOverride(
                                                                     <RecursivePartial<SelectOptions<TValue>>>
                                                                     {
                                                                         optionsGatherer: this,
                                                                         templateGatherer: this,
                                                                     },
                                                                     defaultOptions as SelectOptions<TValue>,
                                                                    //  <RecursivePartial<SelectOptions<TValue>>>
                                                                    //  {
                                                                    //      readonly: readonlyDefault,
                                                                    //      multiple: multipleDefault
                                                                    //  },
                                                                     options)));

        effect(() =>
        {
            const selectOptions = this.selectOptions;

            this.createPlugin(selectOptions.plugins?.liveSearch, SelectPluginType.LiveSearch, this.liveSearchContainer);
            this.createPlugin(selectOptions.plugins?.interactions, SelectPluginType.Interactions, this.interactionsContainer);
            this.createPlugin(selectOptions.plugins?.optionsHandler, SelectPluginType.OptionsHandler, this.optionsHandlerContainer);
            this.createPlugin(selectOptions.plugins?.positioner, SelectPluginType.Positioner, this.positionerContainer);
            this.createPlugin(selectOptions.plugins?.keyboardHandler, SelectPluginType.KeyboardHandler, this.keyboardHandlerContainer);
            this.createPlugin(selectOptions.plugins?.valueHandler, SelectPluginType.ValueHandler, this.valueHandlerContainer);
        });

        effect(() =>
        {
            this.createPlugin(this.selectOptions.plugins?.readonlyState, SelectPluginType.ReadonlyState, this.readonlyStateContainer);
        });

        effect(() =>
        {
            this.createPlugin(this.selectOptions.plugins?.normalState, SelectPluginType.NormalState, this.normalStateContainer);
        });

        effect(() =>
        {
            this.createPlugin(this.selectOptions.plugins?.popup, SelectPluginType.Popup, this.popupContainer);
        });
    }

    // constructor(protected _changeDetector: ChangeDetectorRef,
    //             protected _element: ElementRef<HTMLElement>,
    //             protected _componentFactoryResolver: ComponentFactoryResolver,
    //             protected _appRef: ApplicationRef,
    //             protected _injector: Injector,
    //             protected _pluginBus: PluginBus<TValue>,
    //             @Inject(NG_SELECT_PLUGIN_INSTANCES) protected _pluginInstances: SelectPluginInstances,
    //             @Inject(NG_SELECT_OPTIONS) @Optional() options?: SelectOptions<TValue>,
    //             @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState>,
    //             @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler>,
    //             @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>,
    //             @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>,
    //             @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>,
    //             @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler>,
    //             @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>,
    //             @Attribute('readonly') readonly?: string,
    //             @Attribute('disabled') disabled?: string,
    //             @Attribute('multiple') multiple?: string)
    // {
    //     //at least on of following is present (value is not important)
    //     const readonlyDefault = isPresent(readonly) || isPresent(disabled);
    //     const multipleDefault = isPresent(multiple);
    //     const opts: SelectOptions<TValue> = extend(true, {}, options);

    //     if(!opts.plugins)
    //     {
    //         opts.plugins = {};
    //     }

    //     if(keyboardHandlerType)
    //     {
    //         if(!opts.plugins.keyboardHandler)
    //         {
    //             opts.plugins.keyboardHandler = {};
    //         }

    //         opts.plugins.keyboardHandler.type = keyboardHandlerType;
    //     }

    //     if(normalStateType)
    //     {
    //         if(!opts.plugins.normalState)
    //         {
    //             opts.plugins.normalState = {};
    //         }

    //         opts.plugins.normalState.type = normalStateType;
    //     }

    //     if(popupType)
    //     {
    //         if(!opts.plugins.popup)
    //         {
    //             opts.plugins.popup = {};
    //         }

    //         opts.plugins.popup.type = popupType;
    //     }

    //     if(positionerType)
    //     {
    //         if(!opts.plugins.positioner)
    //         {
    //             opts.plugins.positioner = {};
    //         }

    //         opts.plugins.positioner.type = positionerType;
    //     }

    //     if(readonlyStateType)
    //     {
    //         if(!opts.plugins.readonlyState)
    //         {
    //             opts.plugins.readonlyState = {};
    //         }

    //         opts.plugins.readonlyState.type = readonlyStateType;
    //     }

    //     if(valueHandlerType)
    //     {
    //         if(!opts.plugins.valueHandler)
    //         {
    //             opts.plugins.valueHandler = {};
    //         }

    //         opts.plugins.valueHandler.type = valueHandlerType;
    //     }

    //     if(liveSearchType)
    //     {
    //         if(!opts.plugins.liveSearch)
    //         {
    //             opts.plugins.liveSearch = {};
    //         }

    //         opts.plugins.liveSearch.type = liveSearchType;
    //     }

    //     this._selectOptions = extend(true,
    //                                  <SelectOptions<TValue>>
    //                                  {
    //                                      optionsGatherer: this,
    //                                      templateGatherer: this,
    //                                  },
    //                                  defaultOptions,
    //                                  <SelectOptions<TValue>>
    //                                  {
    //                                      readonly: readonlyDefault,
    //                                      multiple: multipleDefault
    //                                  },
    //                                  opts);

    //     this._pluginBus.selectElement = this._element;
    //     this._pluginBus.selectOptions = this._selectOptions;
    // }

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

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this.changeDetector.detectChanges();
    }

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
     * @param plugin - Plugin to be registered
     * @param pluginType - Key of plugin used for pluginInstances
     * @param pluginName - Name property for plugin from options
     */
    protected createPlugin<TPlugin extends SelectPlugin>(pluginDescription: PluginDescription<TPlugin>,
                                                         pluginType: SelectPluginType,
                                                         pluginViewContainer: ViewContainerRef,
                                                         initOptions: WritableSignal<boolean>,)
    {
        if(!pluginDescription.type)
        {
            throw new Error(`SelectComponent: missing type for plugin '${pluginType}'`);
        }

        const type = resolveForwardRef(pluginDescription.type);
        let newInstance = false;
        initOptions.set(false);

        //new type provided
        if(type != this.pluginTypes[pluginType])
        {
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
            this.pluginInstances[pluginType].options = pluginDescription.options;
        }

        // await this.pluginInstances[pluginType].initOptions();
        // initOptions.set(true);
    }
}
