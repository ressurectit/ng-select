import {SelectApi, SelectCssClasses, SelectOption} from '../interfaces';

/**
 * Defintion of action that can be executed on Select
 */
export type SelectAction<TValue = unknown, TCssClasses = SelectCssClasses> = (ngSelect: SelectApi<TValue, TCssClasses>) => void;

/**
 * Definition of function that can be executed on Select and returns some data
 */
export type SelectFunction<TResult = unknown, TValue = unknown, TCssClasses = SelectCssClasses> = (ngSelect: SelectApi<TValue, TCssClasses>) => TResult;

/**
 * Definition of function used for transformation of select option into display text
 */
export type DisplayTextFunc<TValue = unknown> = (option: SelectOption<TValue>) => string;

/**
 * Definition of function used for checking equality of select options
 */
export type OptionsEqualityFunc<TValue = unknown> = (value: SelectOption<TValue>, compare: SelectOption<TValue>) => boolean;

/**
 * Definition of function used for extracting value from select option
 */
export type ValueExtractorFunc<TValue = unknown> = (option: SelectOption<TValue>) => TValue;
