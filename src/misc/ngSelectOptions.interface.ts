import {OptionsGatherer, LiveSearchFilter} from './optionsGatherer/optionsGatherer.interface';
import {TemplateGatherer} from './templateGatherer.interface';

/**
 * Function used for comparing two values
 */
export interface CompareValueFunc<TValue = any>
{
    /**
     * Compares two values and returns true if objects are equal, otherwise false
     * @param source - First value to be compared
     * @param target - Second value to be compared
     */
    (source: TValue, target: TValue): boolean;
}

/**
 * Function used for normalization of value, used during comparison or search
 */
export interface NormalizeFunc<TValue = any>
{
    /**
     * Normalize provided value, usually used with strings
     * @param value - Value that is being normalized
     */
    (value: TValue): TValue;
}
