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
export interface Positioner<TValue = unknown, TOptions extends PositionOptions = PositionOptions> extends SelectPlugin<TOptions, TValue>
{
}
