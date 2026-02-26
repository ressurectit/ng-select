import {Signal} from '@angular/core';

import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectOption} from '../../selectOption/selectOption.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {ValueExtractorFunc} from '../../..';

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions<TValue = unknown> extends PluginOptions
{
    //######################### properties #########################

    /**
     * Function used to extract value from option, if not provided, select option value will be used as value
     */
    valueExtractor: ValueExtractorFunc<TValue>;
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler<TValue = unknown, TOptions extends ValueHandlerOptions<TValue> = ValueHandlerOptions<TValue>> extends SelectPlugin<TOptions, TValue>
{
    //######################### properties #########################

    /**
     * Current selected options of Select
     */
    readonly selected: Signal<SelectOption<TValue>|SelectOption<TValue>[]|undefined|null>;

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
