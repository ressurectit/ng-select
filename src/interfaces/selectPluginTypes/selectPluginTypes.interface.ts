import {PluginDescription} from '../pluginDescription/pluginDescription.interface';
import {Interactions, InteractionsOptions, KeyboardHandler, KeyboardHandlerOptions, LiveSearch, LiveSearchOptions, NormalState, NormalStateOptions, OptionsHandler, OptionsHandlerOptions, Popup, PopupOptions, Positioner, PositionerOptions, ReadonlyState, ReadonlyStateOptions, ValueHandler, ValueHandlerOptions} from '../plugins';

/**
 * All available types of plugins for Select
 */
export interface SelectPluginTypes<TValue = unknown, TPublicValue = TValue>
{
    /**
     * Handles interactions of plugins and select
     */
    interactions: PluginDescription<Interactions<TValue, TPublicValue>, InteractionsOptions>;

    /**
     * Handles keyboard input from user
     */
    keyboardHandler: PluginDescription<KeyboardHandler<TValue, TPublicValue>, KeyboardHandlerOptions>;

    /**
     * Contains component that is used for live search of options
     */
    liveSearch: PluginDescription<LiveSearch<TValue, TPublicValue>, LiveSearchOptions>;

    /**
     * Component used for displaying normal state of selected value
     */
    normalState: PluginDescription<NormalState<TValue, TPublicValue>, NormalStateOptions>;

    /**
     * Component used for handling available options
     */
    optionsHandler: PluginDescription<OptionsHandler<TValue, TPublicValue>, OptionsHandlerOptions<TValue>>;

    /**
     * Component that handles positioning of popup
     */
    popup: PluginDescription<Popup<TValue, TPublicValue>, PopupOptions>;

    /**
     * Handles correct position of pop component
     */
    positioner: PluginDescription<Positioner<TValue, TPublicValue>, PositionerOptions>;

    /**
     * Component that is used for displaying readonly state of selected value, can be ommited, in that case normal state is used
     */
    readonlyState: PluginDescription<ReadonlyState<TValue, TPublicValue>, ReadonlyStateOptions>;

    /**
     * Component that is used for storing and handling value of select
     */
    valueHandler: PluginDescription<ValueHandler<TValue, TPublicValue>, ValueHandlerOptions>;
}
