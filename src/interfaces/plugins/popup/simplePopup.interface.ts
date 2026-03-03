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
     * Css class applied to each option
     */
    option: string;

    /**
     * Css class applied to each option group
     */
    optionGroup: string;

    /**
     * Css class applied to each option text
     */
    optionText: string;

    /**
     * Css class used as icons indicating that option is selected (only when multiple)
     */
    optionChecked: string;

    /**
     * Css class applied directly to css popup container
     */
    popupContainer: string;
}
