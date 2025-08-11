import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions extends PluginOptions
{
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler extends SelectPlugin
{
}
