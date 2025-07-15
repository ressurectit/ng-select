import {Signal} from '@angular/core';
import {Invalidatable} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {OptionsGatherer} from '../optionsGatherer/optionsGatherer.interface';
import {TemplateGatherer} from '../templateGatherer/templateGatherer.interface';
import {SelectOptions} from '../selectOptions/selectOptions.interface';
import {SelectPlugin} from '../selectPlugin/selectPlugin.interface';
import {SelectAction, SelectFunction} from '../../misc/types';
import {SelectBusEvents} from '../selectBusEvents/selectBusEvents.interface';

/**
 * Public API for Select
 */
export interface Select<TValue = unknown> extends OptionsGatherer<TValue>, TemplateGatherer, Invalidatable
{
    /**
     * Gets information whether is select initialized or not, changes when Select is initialized or reinitialized, if value is false Select was not initialized yet
     */
    readonly initialized: Signal<boolean>;

    /**
     * Gets or sets Select options
     */
    selectOptions: SelectOptions<TValue>;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initialize(): void;

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize SelectOptions
     */
    initOptions(): void;

    /**
     * Gets instance of plugin by its id
     * @param pluginType - Type of plugin
     */
    getPlugin<PluginType extends SelectPlugin>(pluginType: string): PluginType;

    /**
     * Subscribes for event
     * @param eventName - Name of event that should be listened to
     * @param handler - Function used for handling event
     */
    listenTo<TParam = void>(eventName: keyof SelectBusEvents, handler: (data: TParam) => void): Subscription;

    /**
     * Executes actions on Select
     * @param actions - Array of actions that are executed over Select
     */
    execute(...actions: SelectAction<TValue>[]): void;

    /**
     * Executes function on Select and returns result
     * @param func - Function that is executed and its result is returned
     */
    executeAndReturn<TResult>(func: SelectFunction<TResult, TValue>): TResult;
}
