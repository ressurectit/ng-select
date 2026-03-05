import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for interactions plugin
 */
export interface InteractionsOptions extends PluginOptions
{
}

/**
 * Interactions plugin interface
 */
export interface Interactions<TValue = unknown, TOptions extends InteractionsOptions = InteractionsOptions, TAction = string> extends SelectPlugin<TOptions, TValue, TAction>
{
}
