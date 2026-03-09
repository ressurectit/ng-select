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
    readonly events: SelectEvents<TValue>;

    /**
     * Gets instance of plugin by its type
     * @param pluginType - Type of plugin
     */
    getPlugin(pluginType: SelectPluginType.Interactions): Interactions<TValue>;
    getPlugin(pluginType: SelectPluginType.KeyboardHandler): KeyboardHandler<TValue>;
    getPlugin(pluginType: SelectPluginType.LiveSearch): LiveSearch<TValue>;
    getPlugin(pluginType: SelectPluginType.NormalState): NormalState<TValue>;
    getPlugin(pluginType: SelectPluginType.OptionsHandler): OptionsHandler<TValue>;
    getPlugin(pluginType: SelectPluginType.Popup): Popup<TValue>;
    getPlugin(pluginType: SelectPluginType.Positioner): Positioner<TValue>;
    getPlugin(pluginType: SelectPluginType.ReadonlyState): ReadonlyState;
    getPlugin(pluginType: SelectPluginType.ValueHandler): ValueHandler<TValue>;
    getPlugin<PluginInstance extends SelectPlugin>(pluginType: SelectPluginType): PluginInstance;

    /**
     * Executes actions on Select
     * @param actions - Array of actions that are executed over Select
     */
    execute(...actions: SelectAction<TValue, TCssClasses>[]): void;

    /**
     * Executes function on Select and returns result
     * @param func - Function that is executed and its result is returned
     */
    executeAndReturn<TResult>(func: SelectFunction<TResult, TValue, TCssClasses>): TResult;
}
