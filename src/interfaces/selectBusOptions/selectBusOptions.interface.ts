import {DisplayTextFunc, NormalizeTextForComparison, TextComparerFunc, TextExtractorFunc, ValueEqualityFunc, ValueExtractorFunc} from '../../misc/types';
import {OptionsGatherer} from '../optionsGatherer/optionsGatherer.interface';
import {TemplateGatherer} from '../templateGatherer/templateGatherer.interface';

/**
 * Options used for select bus
 */
export interface SelectBusOptions<TValue = unknown>
{
    //######################### properties #########################

    /**
     * Instance of options gatherer that is used for obtaining options
     */
    optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Instance of template gatherer used for obtaining custom templates
     */
    templateGatherer: TemplateGatherer;

    /**
     * Indication whether is Select readonly or not
     */
    readonly: boolean;

    /**
     * Indication that multiple values can be selected
     */
    multiple: boolean;

    /**
     * Placeholder text shown when there is no value selected
     */
    placeholder: string;

    /**
     * Indication whether close popup on selecting value
     */
    closeOnSelect: boolean;

    /**
     * Function used for transformation of selected option into display text
     */
    displaySelectedValue: DisplayTextFunc<TValue>;

    // /**
    //  * Indication whether use non existing value in live search as new value, use with dynamic value handler
    //  */
    // useNonExistingAsValue: boolean;

    /**
     * Function used to extract value from option, if not provided, select option value will be used as value
     */
    valueExtractor: ValueExtractorFunc<TValue>;

    /**
     * Function used for comparing values of select options
     */
    valueComparer: ValueEqualityFunc<TValue>;

    /**
     * Method that is used for filtering when live search is running on static data
     */
    textExtractor: TextExtractorFunc<TValue>;

    /**
     * Normalize text for comparison
     */
    normalize: NormalizeTextForComparison;

    /**
     * Compares two texts of option
     */
    textCompare: TextComparerFunc;
}
