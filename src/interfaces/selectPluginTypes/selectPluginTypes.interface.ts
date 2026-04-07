import {PluginDescription} from '../pluginDescription/pluginDescription.interface';
import {Interactions, InteractionsOptions, KeyboardHandler, KeyboardHandlerOptions, LiveSearch, LiveSearchOptions, NormalState, NormalStateOptions, OptionsHandler, OptionsHandlerOptions, Popup, PopupOptions, Positioner, PositionerOptions, ReadonlyState, ReadonlyStateOptions, ValueHandler, ValueHandlerOptions} from '../plugins';

/**
 * All available types of plugins for Select
 */
export interface SelectPluginTypes
{
    /**
     * Handles interactions of plugins and select
     */
    interactions: PluginDescription<Interactions, InteractionsOptions>;

    /**
     * Handles keyboard input from user
     */
    keyboardHandler: PluginDescription<KeyboardHandler, KeyboardHandlerOptions>;

    /**
     * Contains component that is used for live search of options
     */
    liveSearch: PluginDescription<LiveSearch, LiveSearchOptions>;

    /**
     * Component used for displaying normal state of selected value
     */
    normalState: PluginDescription<NormalState, NormalStateOptions>;

    /**
     * Component used for handling available options
     */
    optionsHandler: PluginDescription<OptionsHandler, OptionsHandlerOptions>;

    /**
     * Component that handles positioning of popup
     */
    popup: PluginDescription<Popup, PopupOptions>;

    /**
     * Handles correct position of pop component
     */
    positioner: PluginDescription<Positioner, PositionerOptions>;

    /**
     * Component that is used for displaying readonly state of selected value, can be ommited, in that case normal state is used
     */
    readonlyState: PluginDescription<ReadonlyState, ReadonlyStateOptions>;

    /**
     * Component that is used for storing and handling value of select
     */
    valueHandler: PluginDescription<ValueHandler, ValueHandlerOptions>;
}
