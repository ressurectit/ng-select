import {PromiseOr} from '@jscrpt/common';

import {HidePopupKeyboardAction, MarkActiveKeyboardAction, SelectActiveKeyboardAction, SelectApi, SelectCssClasses, SelectFirstKeyboardAction, SelectOption, ShowPopupKeyboardAction} from '../interfaces';

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
 * Definition of function used for checking equality of select value
 */
export type ValueEqualityFunc<TValue = unknown> = (source: TValue, target: TValue) => boolean;

/**
 * Definition of function used for extracting value from select option
 */
export type ValueExtractorFunc<TValue = unknown> = (option: SelectOption<TValue>) => TValue;

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
export type SimpleKeyboardActions = MarkActiveKeyboardAction|SelectActiveKeyboardAction|HidePopupKeyboardAction|ShowPopupKeyboardAction|SelectFirstKeyboardAction;

/**
 * Names of simple keyboard action types
 */
export type SimpleKeyboardActionTypes = 'MARK_ACTIVE'|'SELECT_ACTIVE'|'HIDE_POPUP'|'SHOW_POPUP'|'SELECT_FIRST';

/**
 * Definition of function for computed value signal
 */
export type ValueComputedFunc<TValue> = () => TValue|TValue[]|undefined|null;

/**
 * Definition of function for obtaining option for provided value
 */
export type OptionGetterFunc<TValue> = (value: TValue) => PromiseOr<SelectOption<TValue>|undefined|null>;

/**
 * Definition of function for obtaining new option, allows adding new options
 */
export type NewOptionGetterFunc<TValue> = (text: string) => SelectOption<TValue>;
