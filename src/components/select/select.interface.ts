import {Observable, Subscription} from 'rxjs';

import {NgSelectPlugin, NgSelectOptions, OptionsGatherer, TemplateGatherer} from '../../misc';
import {PluginBusEvents} from '../../misc/pluginBus/pluginBus.interface';

/**
 * Defintion of action that can be executed on NgSelect
 */
export type NgSelectAction<TValue = any> = (ngSelect: NgSelect<TValue>) => void;

/**
 * Definition of function that can be executed on NgSelect and returns some data
 */
export type NgSelectFunction<TResult = any, TValue = any> = (ngSelect: NgSelect<TValue>) => TResult;