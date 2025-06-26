import {PluginDescription} from '../pluginDescription/pluginDescription.interface';
import {NormalState, ReadonlyState} from '../plugins';

/**
 * All available types of plugins for Select
 */
export interface SelectPluginTypes
{
    /**
     * Handles keyboard events
     */
    keyboardHandler?: PluginDescription<KeyboardHandler>;

    /**
     * Component used for displaying normal state of select
     */
    normalState?: PluginDescription<NormalState>;

    /**
     * Component used for displaying available options for selection
     */
    popup?: PluginDescription<Popup>;

    /**
     * Handles correct position of pop component
     */
    positioner?: PluginDescription<Positioner>;

    /**
     * Component used for displaying readonly/disabled state of select, can be null, in that case normal state component is used
     */
    readonlyState?: PluginDescription<ReadonlyState>;

    /**
     * Handles obtaining and setting value of component
     */
    valueHandler?: PluginDescription<ValueHandler>;

    /**
     * Contains component that is used for live searching in options
     */
    liveSearch?: PluginDescription<LiveSearch>;
}
