import {NormalStateCssClasses} from './normalState.interface';

/**
 * Css classes for edit normal state plugin.
 */
export interface EditNormalStateCssClasses extends NormalStateCssClasses
{
    /**
     * Applied to currently selected value, which is visible to user (default template)
     */
    value: string;

    /**
     * Applied to "carret", indicating that it is select and there is more options available
     */
    carret: string;

    /**
     * Applied to HTML element that represents normal state main element visible to user
     */
    element: string;

    /**
     * Applied to HTML element that represents whole component
     */
    componentElement: string;

    /**
     * Applied to cancel button that allows clearing selected value
     */
    cancel: string;

    /**
     * Applied to cancel button icon
     */
    cancelIcon: string;
}
