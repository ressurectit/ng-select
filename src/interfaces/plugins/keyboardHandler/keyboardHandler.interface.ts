import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for keyboard handler plugin
 */
export interface KeyboardHandlerOptions extends PluginOptions
{
}

/**
 * Keyboard handler plugin interface
 */
export interface KeyboardHandler<TValue = unknown, TPublicValue = TValue, TOptions extends KeyboardHandlerOptions = KeyboardHandlerOptions, TAction = string> extends SelectPlugin<TOptions, TValue, TPublicValue, TAction>
{
}
