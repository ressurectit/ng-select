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

    /**
     * Displayed when add new option is displayed
     */
    addNewOption: string;
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

    /**
     * Indication whether are popup options visible, or not, force popup to be visible if set to true
     */
    visible: boolean;

    /**
     * Texts that are used within any Popup
     */
    texts: PopupTexts;

    /**
     * Indication whether is live search enabled for popup
     */
    liveSearchEnabled: boolean;
}

/**
 * Popup plugin interface
 */
export interface Popup<TValue = unknown, TOptions extends PopupOptions = PopupOptions> extends SelectPlugin<TOptions, TValue>
{
}
