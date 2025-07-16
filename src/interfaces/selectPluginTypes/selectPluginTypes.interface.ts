import {PluginDescription} from '../pluginDescription/pluginDescription.interface';
import {NormalState, ReadonlyState} from '../plugins';

/**
 * All available types of plugins for Select
 */
export interface SelectPluginTypes
{
    /**
     * Handles interactions of plugins and select
     */
    interactions?: PluginDescription<Interactions>;

    /**
     * Handles keyboard input from user
     */
    keyboardHandler?: PluginDescription<KeyboardHandler>;

    /**
     * Contains component that is used for live search of options
     */
    liveSearch?: PluginDescription<LiveSearch>;

    /**
     * Component used for displaying normal state of selected value
     */
    normalState?: PluginDescription<NormalState>;

    /**
     * Component used for handling available options
     */
    optionsHandler?: PluginDescription<OptionsHandler>;

    /**
     * Component that handles positioning of popup
     */
    popup?: PluginDescription<Popup>;

    /**
     * Handles correct position of pop component
     */
    positioner?: PluginDescription<Positioner>;

    /**
     * Component that is used for displaying readonly state of selected value, can be ommited, in that case normal state is used
     */
    readonlyState?: PluginDescription<ReadonlyState>;

    /**
     * Component that is used for storing and handling value of select
     */
    valueHandler?: PluginDescription<ValueHandler>;
}
