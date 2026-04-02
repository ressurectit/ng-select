import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for interactions plugin
 */
export interface InteractionsOptions extends PluginOptions
{
    //######################### properties #########################

    /**
     * Indication whether click outside should be handled by plugin. If true, click outside will close popup
     */
    handleClickOutside: boolean;
}

/**
 * Interactions plugin interface
 */
export interface Interactions<TValue = unknown, TOptions extends InteractionsOptions = InteractionsOptions, TAction = string> extends SelectPlugin<TOptions, TValue, TAction>
{
}
