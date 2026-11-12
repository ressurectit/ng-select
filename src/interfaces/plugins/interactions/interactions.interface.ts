import {CanShowPopupPredicate} from '../../../misc/types';
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

    /**
     * Predicate that determines whether the select popup can be shown
     */
    canShowPopupPredicate: CanShowPopupPredicate;
}

/**
 * Interactions plugin interface
 */
export interface Interactions<TValue = unknown, TPublicValue = TValue, TOptions extends InteractionsOptions = InteractionsOptions, TAction = string> extends SelectPlugin<TOptions, TValue, TPublicValue, TAction>
{
}
