import {NormalState, NormalStateCssClasses, NormalStateOptions} from '../normalState/normalState.interface';

/**
 * CSS classes for readonly state plugin
 */
export interface ReadonlyStateCssClasses extends NormalStateCssClasses
{
}

/**
 * Options for readonly state plugin
 */
export interface ReadonlyStateOptions<TCssClasses extends ReadonlyStateCssClasses = ReadonlyStateCssClasses> extends NormalStateOptions<TCssClasses>
{
}

/**
 * Readonly state plugin interface
 */
export interface ReadonlyState extends NormalState
{
}
