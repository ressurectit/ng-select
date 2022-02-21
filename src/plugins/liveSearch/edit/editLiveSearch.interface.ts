import {LiveSearch, LiveSearchOptions} from '../liveSearch.interface';

/**
 * Css classes for edit live search
 */
export interface CssClassesEditLiveSearch
{
    /**
     * Applied to wrapper div around input
     */
    wrapperDiv?: string;

    /**
     * Applied to input that represents live search
     */
    input?: string;
}

/**
 * Edit live search options
 */
export interface EditLiveSearchOptions extends LiveSearchOptions<CssClassesEditLiveSearch>
{
    /**
     * Indication whether keep search value after popup close
     */
    keepSearchValue?: boolean;

    /**
     * Indication whether cancel selected value if non existing value is in live search, works for single value
     */
    nonExistingCancel?: boolean;

    /**
     * Indicaiton whether empty string in live search cancel selected value
     */
    emptyCancel?: boolean;
}

/**
 * Public API for 'EditLiveSearchComponent'
 */
export interface EditLiveSearch extends LiveSearch
{
}