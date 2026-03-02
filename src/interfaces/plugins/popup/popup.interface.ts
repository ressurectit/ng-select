import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {VisualPluginOptions} from '../../visualPluginOptions/visualPluginOptions.interface';

/**
 * Texts that are used within Popup
 */
export interface PopupTexts
{
    /**
     * Displayed when there are no available options to be displayed
     */
    noAvailableOptions: string;
}

/**
 * CSS classes for pupup plugin
 */
export interface PopupCssClasses
{
}

/**
 * Options for popup plugin
 */
export interface PopupOptions<TCssClasses extends PopupCssClasses = PopupCssClasses> extends VisualPluginOptions<TCssClasses>
{
    //######################### properties #########################

    // /**
    //  * Function used for transformation options into display text in options list popup
    //  */
    // optionDisplayText: DisplayTextFunc<TValue>;

    /**
     * Indication whether are popup options visible, or not, initial value when displaying select
     */
    visible: boolean;

    /**
     * Texts that are used within any Popup
     */
    texts: PopupTexts;
}

/**
 * Popup plugin interface
 */
export interface Popup<TValue = unknown, TOptions extends PopupOptions = PopupOptions> extends SelectPlugin<TOptions, TValue>
{
}
