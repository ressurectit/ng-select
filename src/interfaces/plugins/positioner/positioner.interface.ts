import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
}

/**
 * Positioner plugin interface
 */
export interface Positioner<TValue = unknown, TPublicValue = TValue, TOptions extends PositionerOptions = PositionerOptions> extends SelectPlugin<TOptions, TValue, TPublicValue>
{
}
