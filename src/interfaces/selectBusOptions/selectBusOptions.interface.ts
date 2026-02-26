import {ValueExtractorFunc} from '../../misc/types';
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

    // /**
    //  * Indication whether use non existing value in live search as new value, use with dynamic value handler
    //  */
    // useNonExistingAsValue: boolean;

    /**
     * Function used to extract value from option, if not provided, select option value will be used as value
     */
    valueExtractor: ValueExtractorFunc<TValue>;

    // /**
    //  * Method that is used for filtering when live search is running on static data
    //  */
    // liveSearchFilter?: LiveSearchFilter<TValue>;

    // /**
    //  * Normalizer used for normalizing values
    //  */
    // normalizer?: NormalizeFunc<TValue>;
}
