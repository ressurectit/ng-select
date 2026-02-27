import {untracked} from '@angular/core';

import {SelectOption} from '../interfaces';
import {SelectBus} from './classes';

/**
 * Compares value and select option
 * @param value - Value to be compared
 * @param option - Option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareValueAndOption<TValue>(value: TValue, option: SelectOption<TValue>, selectBus: SelectBus<TValue>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(value, selectBus.selectOptions().valueExtractor(option)));
}

/**
 * Compares two select options
 * @param source - Source option to be compared
 * @param target - Target option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareSelectOptions<TValue>(source: SelectOption<TValue>, target: SelectOption<TValue>, selectBus: SelectBus<TValue>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(selectBus.selectOptions().valueExtractor(source), selectBus.selectOptions().valueExtractor(target)));
}
