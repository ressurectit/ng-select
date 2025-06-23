import {InjectionToken} from '@angular/core';

import {NgSelectPluginInstances} from './select.interface';

/**
 * Token used for obtaining 'NgSelectPluginInstances'
 */
export const NG_SELECT_PLUGIN_INSTANCES: InjectionToken<NgSelectPluginInstances> = new InjectionToken<NgSelectPluginInstances>('NG_SELECT_PLUGIN_INSTANCES');

/**
 * Defintion of action that can be executed on NgSelect
 */
export type NgSelectAction<TValue = any> = (ngSelect: NgSelect<TValue>) => void;

/**
 * Definition of function that can be executed on NgSelect and returns some data
 */
export type NgSelectFunction<TResult = any, TValue = any> = (ngSelect: NgSelect<TValue>) => TResult;
