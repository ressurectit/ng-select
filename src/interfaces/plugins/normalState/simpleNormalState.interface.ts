import {NormalStateCssClasses} from './normalState.interface';

export interface SimpleNormalStateCssClasses extends NormalStateCssClasses
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
     * Applied to HTML element that represents normal default state container element visible to user
     */
    containerElement: string;

    /**
     * Applied to HTML element that represents whole component
     */
    componentElement: string;
}
