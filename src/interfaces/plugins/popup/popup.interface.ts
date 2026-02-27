import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for popup plugin
 */
export interface PopupOptions extends PluginOptions
{
    // /**
    //  * Function used for transformation options into display text in options list popup
    //  */
    // optionDisplayText: DisplayTextFunc<TValue>;
}

/**
 * Popup plugin interface
 */
export interface Popup extends SelectPlugin
{
}
