import {Component, ChangeDetectionStrategy, Input, viewChild, ViewContainerRef, Signal, WritableSignal, signal, Inject, Optional, Type, resolveForwardRef, FactoryProvider, effect, forwardRef, Attribute, ElementRef, computed, input, booleanAttribute, InputSignalWithTransform, ComponentRef, DOCUMENT, TemplateRef, contentChild, contentChildren} from '@angular/core';
import {getHostElement} from '@anglr/common';
import {isPresent, RecursivePartial, renderToBody} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, NormalStateContext, OptionsGatherer, OptionsHandler, PluginDescription, Popup, PopupContext, Positioner, ReadonlyState, SelectApi, SelectCssClasses, SelectEvents, SelectOption, SelectOptions, SelectPlugin, TemplateGatherer, ValueHandler} from '../../interfaces';
import {INTERACTIONS_TYPE, KEYBOARD_HANDLER_TYPE, LIVE_SEARCH_TYPE, NORMAL_STATE_TYPE, OPTIONS_HANDLER_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, SELECT_OPTIONS, VALUE_HANDLER_TYPE} from '../../misc/tokens';
import {SelectPluginType} from '../../misc/enums';
import {SelectBus, SelectPluginInstances} from '../../misc/classes';
import {BasicPositionerComponent, BasicValueHandlerComponent, NoInteractionsComponent, NoLiveSearchComponent, NoOptionsHandlerComponent, SimpleKeyboardHandlerComponent, SimpleNormalStateComponent, SimplePopupComponent} from '../../plugins';
import {CopyOptionsAsSignal} from '../../decorators';
import {SelectAction, SelectFunction} from '../../misc/types';
import {NormalStateTemplate, OptionTemplate} from '../../directives';

//TODO: optimize options change detection, currently it is based on reference change, but it could be optimized by checking only changed properties, or by using signals for options properties

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
export class Select<TValue = unknown, TCssClasses = SelectCssClasses> implements SelectApi<TValue, TCssClasses>, OptionsGatherer<TValue>, TemplateGatherer
{
    //######################### protected fields #########################

    /**
     * Instance of popup component used for positioning over page body when absolute option is true
     */
    protected popupComponentRef: ComponentRef<Popup>|undefined|null;

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

    /**
     * Indication whether should be Select disabled or not
     */
    public disabled: InputSignalWithTransform<boolean, string | boolean> = input<boolean, boolean|string>(false, {transform: booleanAttribute});

    /**
     * Indication whether should be Select readonly or not
     */
    public readonly: InputSignalWithTransform<boolean, string | boolean> = input<boolean, boolean|string>(false, {transform: booleanAttribute});

    //######################### public properties - implementation of SelectApi #########################

    /**
     * @inheritdoc
     */
    public readonly initialized: Signal<boolean> = computed(() => this.normalStateInit() &&
                                                                  this.keyboardInit() &&
                                                                  this.popupInit() &&
                                                                  this.positionerInit() &&
                                                                  this.readonlyStateInit() &&
                                                                  this.valueHandlerInit() &&
                                                                  this.liveSearchInit() &&
                                                                  this.interactionsInit() &&
                                                                  this.optionsHandlerInit());

    /**
     * @inheritdoc
     */
    public get events(): SelectEvents
    {
        return this.bus;
    }

    //######################### public properties - implementation of TemplateGatherer #########################

    /**
     * @inheritdoc
     */
    public readonly normalStateTemplate: Signal<TemplateRef<NormalStateContext>|undefined|null> = contentChild(NormalStateTemplate, {read: TemplateRef});

    /**
     * @inheritdoc
     */
    public readonly optionTemplate: Signal<TemplateRef<PopupContext>|undefined|null> = contentChild(OptionTemplate, {read: TemplateRef});

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of all available options for select
     */
    public readonly availableOptions: Signal<readonly SelectOption<TValue>[]|undefined|null> = contentChildren<SelectOption<TValue>>(Option);

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
                @Inject(DOCUMENT) document: HTMLDocument,
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
        //is present (value is not important)
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
                multiple: multipleDefault,
            },
            opts);

        bus.selectElement.set(element);
        bus.selectOptions = computed(() => this.selectOptions);

        //dynamic update of readonly state in options
        effect(() =>
        {
            this.selectOptions =
            <RecursivePartial<SelectOptions<TValue>>>
            {
                readonly: this.readonly() || this.disabled(),
            } as SelectOptions<TValue, TCssClasses>;
        });

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

            if(selectOptions.absolute && this.popupComponentRef)
            {
                const element = getHostElement(this.popupComponentRef);

                if(!element)
                {
                    throw new Error('Could not get element of popup component');
                }

                renderToBody(document, element, selectOptions.containerElement);
            }
        });
    }

    //######################### public methods #########################

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
     * @inheritdoc
     */
    public getPlugin<PluginInstance extends SelectPlugin>(pluginType: SelectPluginType): PluginInstance
    {
        return this.pluginInstances[pluginType] as PluginInstance;
    }

    /**
     * @inheritdoc
     */
    public execute(...actions: SelectAction<TValue>[])
    {
        if(!actions)
        {
            return;
        }

        actions.forEach(action => action(this));
    }

    /**
     * @inheritdoc
     */
    public executeAndReturn<TResult>(func: SelectFunction<TResult, TValue>): TResult
    {
        if(!func)
        {
            throw new Error('Function is required');
        }

        return func(this);
    }

    // //######################### protected methods #########################

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

            if(pluginType == SelectPluginType.Popup)
            {
                this.popupComponentRef = component;
            }
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
        if(pluginType == SelectPluginType.Popup)
        {
            this.popupComponentRef = null;
        }

        pluginViewContainer.clear();
        initOptions.set(false);
        this.pluginTypes[pluginType] = null;
    }
}
