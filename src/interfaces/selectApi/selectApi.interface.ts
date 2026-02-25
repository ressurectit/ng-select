import {Signal} from '@angular/core';

import {SelectOptions} from '../selectOptions/selectOptions.interface';
import {SelectPlugin} from '../selectPlugin/selectPlugin.interface';
import {SelectAction, SelectFunction} from '../../misc/types';
import {SelectEvents} from '../selectEvents/selectEvents.interface';
import {SelectPluginType} from '../../misc/enums';
import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, ValueHandler} from '../plugins';
import {SelectCssClasses} from '../selectCssClasses/selectCssClasses.interface';

/**
 * Public API for Select
 */
export interface SelectApi<TValue = unknown, TCssClasses = SelectCssClasses>
{
    /**
     * Gets information whether is select initialized or not, changes when Select is initialized or reinitialized, if value is false Select was not initialized yet
     */
    readonly initialized: Signal<boolean>;

    /**
     * Gets or sets Select options
     */
    selectOptions: SelectOptions<TValue, TCssClasses>;

    /**
     * Select public events, signal based
     */
    readonly events: SelectEvents;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initialize(): void;

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize SelectOptions
     */
    initOptions(): void;

    /**
     * Gets instance of plugin by its type
     * @param pluginType - Type of plugin
     */
    getPlugin(pluginType: SelectPluginType.Interactions): Interactions;
    getPlugin(pluginType: SelectPluginType.KeyboardHandler): KeyboardHandler;
    getPlugin(pluginType: SelectPluginType.LiveSearch): LiveSearch;
    getPlugin(pluginType: SelectPluginType.NormalState): NormalState;
    getPlugin(pluginType: SelectPluginType.OptionsHandler): OptionsHandler;
    getPlugin(pluginType: SelectPluginType.Popup): Popup;
    getPlugin(pluginType: SelectPluginType.Positioner): Positioner;
    getPlugin(pluginType: SelectPluginType.ReadonlyState): ReadonlyState;
    getPlugin(pluginType: SelectPluginType.ValueHandler): ValueHandler;
    getPlugin<PluginInstance extends SelectPlugin>(pluginType: SelectPluginType): PluginInstance;

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
