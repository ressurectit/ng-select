import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for popup plugin
 */
export interface PopupOptions extends PluginOptions
{
}

/**
 * Popup plugin interface
 */
export interface Popup extends SelectPlugin
{
}
