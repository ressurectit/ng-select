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
export interface SelectApi<TValue = unknown, TPublicValue = TValue, TCssClasses = SelectCssClasses>
{
    /**
     * Gets information whether is select initialized or not, changes when Select is initialized or reinitialized, if value is false Select was not initialized yet
     */
    readonly initialized: Signal<boolean>;

    /**
     * Gets or sets Select options
     */
    selectOptions: SelectOptions<TValue, TPublicValue, TCssClasses>;

    /**
     * Select public events, signal based
     */
    readonly events: SelectEvents;

    /**
     * Gets instance of plugin by its type
     * @param pluginType - Type of plugin
     */
    getPlugin(pluginType: SelectPluginType.Interactions): Interactions<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.KeyboardHandler): KeyboardHandler<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.LiveSearch): LiveSearch<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.NormalState): NormalState<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.OptionsHandler): OptionsHandler<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.Popup): Popup<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.Positioner): Positioner<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.ReadonlyState): ReadonlyState<TValue, TPublicValue>;
    getPlugin(pluginType: SelectPluginType.ValueHandler): ValueHandler<TValue, TPublicValue>;
    getPlugin<PluginInstance extends SelectPlugin<unknown, TValue, TPublicValue>>(pluginType: SelectPluginType): PluginInstance;

    /**
     * Executes actions on Select
     * @param actions - Array of actions that are executed over Select
     */
    execute(...actions: SelectAction<TValue, TPublicValue, TCssClasses>[]): void;

    /**
     * Executes function on Select and returns result
     * @param func - Function that is executed and its result is returned
     */
    executeAndReturn<TResult>(func: SelectFunction<TResult, TValue, TPublicValue, TCssClasses>): TResult;
}
