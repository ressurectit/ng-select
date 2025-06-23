import {Select} from '../interfaces';

/**
 * Defintion of action that can be executed on Select
 */
export type SelectAction<TValue = unknown> = (ngSelect: Select<TValue>) => void;

/**
 * Definition of function that can be executed on Select and returns some data
 */
export type SelectFunction<TResult = unknown, TValue = unknown> = (ngSelect: Select<TValue>) => TResult;
