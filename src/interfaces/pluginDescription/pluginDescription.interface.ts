import {Type} from '@angular/core';

import {SelectPlugin} from '../selectPlugin/selectPlugin.interface';
import {PluginOptions} from '../pluginOptions/pluginOptions.interface';

/**
 * Description of plugin, used for creating plugin instance
 */
export interface PluginDescription<PluginType = unknown>
{
    /**
     * Type of plugin that will be dynamically instantiated
     */
    type?: Type<PluginType>|null;

    /**
     * Options that will be passed to dynamically instantiated plugin
     */
    options?: PluginOptions;

    /**
     * Optional callback used for obtaining dynamic instance of plugin (allows direct communication with plugin)
     */
    instanceCallback?: (instance: SelectPlugin|undefined|null) => void;
}
