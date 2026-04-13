import {PromiseOr} from '@jscrpt/common';

import {RemoveLastSelectedValueKeyboardAction, SelectActiveKeyboardAction, SelectApi, SelectCssClasses, SelectFirstKeyboardAction, SelectOption} from '../interfaces';

/**
 * Defintion of action that can be executed on Select
 */
export type SelectAction<TValue = unknown, TPublicValue = TValue, TCssClasses = SelectCssClasses> = (select: SelectApi<TValue, TPublicValue, TCssClasses>) => void;

/**
 * Definition of function that can be executed on Select and returns some data
 */
export type SelectFunction<TResult = unknown, TValue = unknown, TPublicValue = TValue, TCssClasses = SelectCssClasses> = (select: SelectApi<TValue, TPublicValue, TCssClasses>) => TResult;

/**
 * Definition of function used for transformation of select option into display text
 */
export type DisplayTextFunc<TValue = unknown> = (option: SelectOption<TValue>) => string;

/**
 * Definition of function used for checking equality of select value
 */
export type ValueEqualityFunc<TValue = unknown> = (source: TValue, target: TValue) => boolean;

/**
 * Definition of function used for extracting value from select option
 */
export type ValueExtractorFunc<TValue = unknown, TPublicValue = TValue> = (option: SelectOption<TValue>) => TPublicValue;

/**
 * Normalize text for comparison, removes accent sensitive data
 */
export type NormalizeTextForComparison = <TText extends string|undefined|null>(text: TText) => TText;

/**
 * Definition of function that extracts text for comparison/filtering/searching
 */
export type TextExtractorFunc<TValue> = (option: SelectOption<TValue>) => string;

/**
 * Definition of function used for comparison two texts
 */
export type TextComparerFunc = (source: string, target: string) => boolean;

/**
 * Definition of simple keyboard actions
 */
export type SimpleKeyboardActions = SelectActiveKeyboardAction|SelectFirstKeyboardAction|RemoveLastSelectedValueKeyboardAction;

/**
 * Names of simple keyboard action types
 */
export type SimpleKeyboardActionTypes = 'SELECT_ACTIVE'|'SELECT_FIRST'|'REMOVE_LAST_SELECTED_VALUE';

/**
 * Definition of function for computed value signal
 */
export type ValueComputedFunc<TValue> = () => TValue|TValue[]|undefined|null;

/**
 * Definition of function for obtaining option for provided value
 */
export type OptionGetterFunc<TValue, TPublicValue> = (value: TPublicValue) => PromiseOr<SelectOption<TValue>|undefined|null>;

/**
 * Definition of function for obtaining new option, allows adding new options
 */
export type NewOptionGetterFunc<TValue> = (text: string) => SelectOption<TValue>;
