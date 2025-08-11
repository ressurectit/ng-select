import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for options handler plugin
 */
export interface OptionsHandlerOptions extends PluginOptions
{
}

/**
 * Options handler plugin interface
 */
export interface OptionsHandler extends SelectPlugin
{
}
