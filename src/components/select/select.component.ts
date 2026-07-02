import {Component, ChangeDetectionStrategy, Input, viewChild, ViewContainerRef, Signal, WritableSignal, signal, Inject, Optional, Type, resolveForwardRef, FactoryProvider, effect, forwardRef, Attribute, ElementRef, computed, input, booleanAttribute, InputSignalWithTransform, ComponentRef, DOCUMENT, TemplateRef, contentChild, contentChildren} from '@angular/core';
import {getHostElement, LOGGER, Logger} from '@anglr/common';
import {isPresent, RecursivePartial, renderToBody, normalizeAccent} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {InitState, Interactions, InteractionsOptions, KeyboardHandler, KeyboardHandlerOptions, LiveSearch, LiveSearchOptions, NormalState, NormalStateContext, NormalStateOptions, NormalStateTagContext, OptionsGatherer, OptionsHandler, OptionsHandlerOptions, PluginDescription, Popup, PopupContext, PopupOptions, Positioner, PositionerOptions, ReadonlyState, ReadonlyStateOptions, SelectApi, SelectCssClasses, SelectEvents, SelectOption, SelectOptions, SelectOptionState, SelectPlugin, TemplateGatherer, ValueHandler, ValueHandlerOptions} from '../../interfaces';
import {INTERACTIONS_TYPE, KEYBOARD_HANDLER_TYPE, LIVE_SEARCH_TYPE, NORMAL_STATE_TYPE, OPTIONS_HANDLER_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, SELECT_OPTIONS, VALUE_HANDLER_TYPE} from '../../misc/tokens';
import {SelectPluginType} from '../../misc/enums';
import {SelectBus, SelectPluginInstances} from '../../misc/classes';
import {CommonPositioner, StaticValueHandler, SimpleInteractions, SimpleOptionsHandler, SimpleKeyboardHandler, SimpleNormalState, SimplePopup, NoLiveSearch} from '../../plugins';
import {CopyOptionsAsSignal} from '../../decorators';
import {SelectAction, SelectFunction} from '../../misc/types';
import {NormalStateTagTemplate, NormalStateTemplate, OptionTemplate} from '../../directives';
import {Option} from '../option/option.component';

//TODO: optimize options change detection, currently it is based on reference change, but it could be optimized by checking only changed properties, or by using signals for options properties

/**
 * Default 'SelectOptions'
 */
const defaultOptions: Omit<SelectOptions, 'optionsGatherer'|'templateGatherer'> =
{
    absolute: false,
    multiple: false,
    readonly: false,
    containerElement: 'div.select-component',
    placeholder: 'please select value',
    closeOnSelect: true,
    displaySelectedValue: option => option.text(),
    displayOptionValue: null,
    valueExtractor: (option: SelectOption) => option.value(),
    valueComparer: (source, target) => source === target,
    textExtractor: (option: SelectOption) => option.text(),
    normalize: <TText extends string|undefined|null>(value: TText) => isPresent(value) ? normalizeAccent(value) as TText : value,
    textCompare: (source: string, target: string) => !!source.match(new RegExp(target, 'i')),
    cssClasses:
    {
        visualContainer: 'visual-container',
        selectElement: 'select-component',
    },
    plugins:
    {
        interactions: <PluginDescription<Interactions, InteractionsOptions>>
        {
            type: forwardRef(() => SimpleInteractions),
        },
        keyboardHandler: <PluginDescription<KeyboardHandler, KeyboardHandlerOptions>>
        {
            type: forwardRef(() => SimpleKeyboardHandler),
        },
        liveSearch: <PluginDescription<LiveSearch, LiveSearchOptions>>
        {
            type: forwardRef(() => NoLiveSearch),
        },
        normalState: <PluginDescription<NormalState, NormalStateOptions>>
        {
            type: forwardRef(() => SimpleNormalState),
        },
        optionsHandler: <PluginDescription<OptionsHandler, OptionsHandlerOptions>>
        {
            type: forwardRef(() => SimpleOptionsHandler),
        },
        popup: <PluginDescription<Popup, PopupOptions>>
        {
            type: forwardRef(() => SimplePopup),
        },
        positioner: <PluginDescription<Positioner, PositionerOptions>>
        {
            type: forwardRef(() => CommonPositioner),
        },
        readonlyState: <PluginDescription<ReadonlyState, ReadonlyStateOptions>>
        {
            type: forwardRef(() => SimpleNormalState),
        },
        valueHandler: <PluginDescription<ValueHandler, ValueHandlerOptions>>
        {
            type: forwardRef(() => StaticValueHandler),
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
    host:
    {
        '[class]': 'selectOptions.cssClasses.selectElement',
    },
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
export class Select<TValue = unknown, TPublicValue = TValue> implements SelectApi<TValue, TPublicValue, SelectCssClasses>, OptionsGatherer<TValue>, TemplateGatherer<TValue, TPublicValue>
{
    //######################### protected fields #########################

    /**
     * Instance of popup component used for positioning over page body when absolute option is true
     */
    protected popupComponentRef: ComponentRef<Popup<TValue, TPublicValue>>|undefined|null;

    /**
     * Object storing current used plugin type
     */
    protected pluginTypes: Record<SelectPluginType, Type<SelectPlugin<unknown, TValue, TPublicValue>>|undefined|null> =
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
     * Signal that holds init state of live search plugin
     */
    protected liveSearchInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of interactions plugin
     */
    protected interactionsInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of options handler plugin
     */
    protected optionsHandlerInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of positioner plugin
     */
    protected positionerInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of keyboard plugin
     */
    protected keyboardInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of value handler plugin
     */
    protected valueHandlerInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of readonly state plugin
     */
    protected readonlyStateInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of normal state plugin
     */
    protected normalStateInit: WritableSignal<boolean> = signal(false);

    /**
     * Signal that holds init state of popup plugin
     */
    protected popupInit: WritableSignal<boolean> = signal(false);

    /**
     * Initialization state of all plugin init options
     */
    protected optionsInit: Signal<InitState> = computed(() => ({initialized: this.normalStateInit() &&
                                                                             this.keyboardInit() &&
                                                                             this.popupInit() &&
                                                                             this.positionerInit() &&
                                                                             this.readonlyStateInit() &&
                                                                             this.valueHandlerInit() &&
                                                                             this.liveSearchInit() &&
                                                                             this.interactionsInit() &&
                                                                             this.optionsHandlerInit()}));

    /**
     * Information whether is select initialized or not, changes when Select is initialized or reinitialized, if value is false Select was not initialized yet
     */
    protected initializedSignal: WritableSignal<boolean> = signal(false);

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

    //######################### public properties #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public selectOptions: SelectOptions<TValue, TPublicValue, SelectCssClasses>;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets Select options
     */
    @Input({alias: 'selectOptions'})
    public get selectOptionsInput(): SelectOptions<TValue, TPublicValue, SelectCssClasses>
    {
        return this.selectOptions;
    }
    public set selectOptionsInput(value: RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>>)
    {
        this.selectOptions = value as SelectOptions<TValue, TPublicValue, SelectCssClasses>;
    }

    /**
     * Indication whether should be Select disabled or not
     */
    public disabled: InputSignalWithTransform<boolean, string|boolean> = input<boolean, boolean|string>(false, {transform: booleanAttribute});

    /**
     * Indication whether should be Select readonly or not
     */
    public readonly: InputSignalWithTransform<boolean, string|boolean> = input<boolean, boolean|string>(false, {transform: booleanAttribute});

    //######################### public properties - implementation of SelectApi #########################

    /**
     * @inheritdoc
     */
    public get initialized(): Signal<boolean>
    {
        return this.initializedSignal.asReadonly();
    }

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
    public readonly normalStateTemplate: Signal<TemplateRef<NormalStateContext<TValue, TPublicValue>>|undefined|null> = contentChild(NormalStateTemplate, {read: TemplateRef});

    /**
     * @inheritdoc
     */
    public readonly optionTemplate: Signal<TemplateRef<PopupContext<TValue, TPublicValue>>|undefined|null> = contentChild(OptionTemplate, {read: TemplateRef});

    /**
     * @inheritdoc
     */
    public readonly normalStateTagTemplate: Signal<TemplateRef<NormalStateTagContext<TValue, TPublicValue>>|undefined|null> = contentChild(NormalStateTagTemplate, {read: TemplateRef});

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of all available options for select
     */
    public readonly availableOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null> = contentChildren<SelectOptionState<TValue>>(Option, {descendants: true});

    //######################### constructors #########################
    constructor(protected pluginInstances: SelectPluginInstances<TValue, TPublicValue>,
                protected bus: SelectBus<TValue, TPublicValue>,
                @Inject(LOGGER) protected logger: Logger,
                element: ElementRef<HTMLElement>,
                @Inject(DOCUMENT) document: HTMLDocument,
                @Attribute('multiple') multiple?: string|null,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState<TValue, TPublicValue>>|null,
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler<TValue, TPublicValue>>|null,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup<TValue, TPublicValue>>|null,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner<TValue, TPublicValue>>|null,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState<TValue, TPublicValue>>|null,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler<TValue, TPublicValue>>|null,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch<TValue, TPublicValue>>|null,
                @Inject(INTERACTIONS_TYPE) @Optional() interactionsType?: Type<Interactions<TValue, TPublicValue>>|null,
                @Inject(OPTIONS_HANDLER_TYPE) @Optional() optionsHandlerType?: Type<OptionsHandler<TValue, TPublicValue>>|null,
                @Inject(SELECT_OPTIONS) @Optional() options?: RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>>|null,)
    {
        //is present (value is not important)
        const multipleDefault = isPresent(multiple);
        const opts: RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>> = deepCopyWithArrayOverride({}, options);

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
            <RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>>>
            {
                optionsGatherer: this,
                templateGatherer: this,
            },
            defaultOptions as SelectOptions<TValue, TPublicValue, SelectCssClasses>,
            <RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>>>
            {
                multiple: multipleDefault,
            },
            opts);

        this.logger.verbose('Select: ctor options initialized {{@(4)options}}', {options: this.selectOptions});

        bus.selectElement = signal(element).asReadonly();
        bus.selectOptions = computed(() => this.selectOptions);

        //dynamic update of readonly state in options
        effect(() =>
        {
            const readonly = this.readonly() || this.disabled();

            this.selectOptions =
            <RecursivePartial<SelectOptions<TValue, TPublicValue, SelectCssClasses>>>
            {
                readonly: readonly,
            } as SelectOptions<TValue, TPublicValue, SelectCssClasses>;

            this.logger.verbose('Select: readonly updated {{readonly}}', {readonly});
        });

        //create and initialize options for static plugins
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

        //create and initialize options for state plugins (normal and readonly)
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

        //create and initialize options for popup plugin, allows absolute positioning
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

        //initialize plugins when all options are initialized
        effect(() =>
        {
            this.initializedSignal.set(false);

            if(this.optionsInit().initialized)
            {
                this.initializedSignal.set(true);
            }
        });
    }

    //######################### public methods #########################

    /**
     * @inheritdoc
     */
    public getPlugin(pluginType: SelectPluginType.Interactions): Interactions<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.KeyboardHandler): KeyboardHandler<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.LiveSearch): LiveSearch<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.NormalState): NormalState<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.OptionsHandler): OptionsHandler<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.Popup): Popup<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.Positioner): Positioner<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.ReadonlyState): ReadonlyState<TValue, TPublicValue>;
    public getPlugin(pluginType: SelectPluginType.ValueHandler): ValueHandler<TValue, TPublicValue>;
    public getPlugin<PluginInstance extends SelectPlugin<unknown, TValue, TPublicValue>>(pluginType: SelectPluginType): PluginInstance
    {
        return this.pluginInstances[pluginType] as PluginInstance;
    }

    /**
     * @inheritdoc
     */
    public execute(...actions: SelectAction<TValue, TPublicValue, SelectCssClasses>[])
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
    public executeAndReturn<TResult>(func: SelectFunction<TResult, TValue, TPublicValue, SelectCssClasses>): TResult
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
    protected async createPlugin<TPlugin extends SelectPlugin<unknown, TValue, TPublicValue>>(pluginDescription: PluginDescription<TPlugin>|undefined|null,
                                                                                              pluginType: SelectPluginType,
                                                                                              pluginViewContainer: ViewContainerRef,
                                                                                              initOptions: WritableSignal<boolean>,): Promise<void>
    {
        this.logger.verbose('Select: creating plugin "{{type}}", with type "{{typ}}"', {type: pluginType, typ: pluginDescription?.type});

        if(!pluginDescription?.type)
        {
            this.destroyPlugin(pluginType, pluginViewContainer, initOptions);

            return;
        }

        const type = resolveForwardRef(pluginDescription.type);

        //new type provided
        if(type != this.pluginTypes[pluginType])
        {
            this.logger.verbose('Select: creating plugin instance for "{{type}}"', {type: pluginType});

            initOptions.set(false);
            this.pluginTypes[pluginType] = type;
            pluginViewContainer.clear();

            const component = pluginViewContainer.createComponent(type);
            component.changeDetectorRef.detectChanges();
            this.pluginInstances[pluginType] = component.instance;

            if(pluginType == SelectPluginType.Popup)
            {
                this.popupComponentRef = component as ComponentRef<Popup<TValue, TPublicValue>>;
            }
        }

        //options are available, set them
        if(pluginDescription.options)
        {
            this.logger.verbose('Select: setting options for "{{type}}" plugin, options: {{@(4)options}}', {type: pluginType, options: pluginDescription.options});

            initOptions.set(false);
            this.pluginInstances[pluginType].options = pluginDescription.options;
        }

        this.logger.verbose('Select: options initialized for "{{type}}" plugin', {type: pluginType});
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

        this.logger.verbose('Select: destroying plugin "{{type}}"', {type: pluginType});

        pluginViewContainer.clear();
        initOptions.set(false);
        this.pluginTypes[pluginType] = null;
    }
}
