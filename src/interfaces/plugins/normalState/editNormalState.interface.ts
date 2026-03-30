import {NormalStateCssClasses, NormalStateOptions} from './normalState.interface';

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
     * Applied to tag that represents selected value
     */
    tag: string;

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

    /**
     * Applied to HTML element that wraps selected value
     */
    valueWrapper: string;

    /**
     * Applied to HTML element that represents value and holds multiple selected values
     */
    valueMultiple: string;

    /**
     * Applied to HTML element that represents value and holds single selected value
     */
    valueSingle: string;
}

/**
 * Options for edit normal state plugin
 */
export interface EditNormalStateOptions<TCssClasses extends EditNormalStateCssClasses = EditNormalStateCssClasses> extends NormalStateOptions<TCssClasses>
{
    //######################### properties #########################

    /**
     * Indication whether show carret icon
     */
    carret: boolean;
}
