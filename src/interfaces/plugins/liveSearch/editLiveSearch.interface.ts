import {LiveSearchCssClasses} from './liveSearch.interface';

/**
 * Css classes for edit live search
 */
export interface EditLiveSearchCssClasses extends LiveSearchCssClasses
{
    //######################### properties #########################

    /**
     * Applied to HTML element that represents the search input
     */
    searchElement: string;

    /**
     * Applied to HTML element that represents the search input when the select is in multiple mode
     */
    multiple: string;

    /**
     * Applied to HTML element that represents the search input when the select is in single mode
     */
    single: string;
}
