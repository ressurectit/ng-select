import {PopupCssClasses} from './popup.interface';

/**
 * CSS classes for simple popup plugin
 */
export interface SimplePopupCssClasses extends PopupCssClasses
{
    /**
     * Css class applied to component itself
     */
    componentElement: string;

    /**
     * Css class applied to each option div
     */
    optionItemDiv: string;

    /**
     * Css class applied to each option text div
     */
    optionItemTextDiv: string;

    /**
     * Css class used as icons indicating that option is selected (only when multiple)
     */
    optionChecked: string;

    /**
     * Css class applied directly to css popup
     */
    popupDiv: string;
}
