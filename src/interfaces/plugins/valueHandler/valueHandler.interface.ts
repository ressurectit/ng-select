import {Signal} from '@angular/core';

import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions extends PluginOptions
{
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler<TValue = unknown, TOptions extends ValueHandlerOptions = ValueHandlerOptions> extends SelectPlugin<TOptions, TValue>
{
    //######################### properties #########################

    /**
     * Current selected value of Select
     */
    readonly value: Signal<TValue|TValue[]|undefined|null>;

    //######################### methods #########################

    /**
     * Sets value for Select
     * @param value - Value to be set
     */
    setValue(value: TValue|TValue[]|undefined|null): void;
}
