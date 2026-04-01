import {LiveSearchCssClasses, LiveSearchOptions} from './liveSearch.interface';

/**
 * Texts that are used within filter live search
 */
export interface FilterLiveSearchTexts
{
    //######################### properties #########################

    /**
     * Placeholder for search input
     */
    searchPlaceholder: string;
}

/**
 * Options for filter live search plugin
 */
export interface FilterLiveSearchOptions<TCssClasses extends LiveSearchCssClasses = LiveSearchCssClasses> extends LiveSearchOptions<TCssClasses>
{
    //######################### properties #########################

    /**
     * Texts that are used within filter live search
     */
    texts: FilterLiveSearchTexts;
}
