import {NormalState, NormalStateOptions} from '../normalState/normalState.interface';

/**
 * Options for readonly state plugin
 */
export interface ReadonlyStateOptions<TCssClasses = unknown> extends NormalStateOptions<TCssClasses>
{
}

/**
 * Readonly state plugin interface
 */
export interface ReadonlyState extends NormalState
{
}
