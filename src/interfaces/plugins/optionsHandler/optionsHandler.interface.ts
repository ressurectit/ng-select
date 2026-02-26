import {Signal} from '@angular/core';

import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {SelectOption} from '../../selectOption/selectOption.interface';

/**
 * Options for options handler plugin
 */
export interface OptionsHandlerOptions extends PluginOptions
{
}

/**
 * Options handler plugin interface
 */
export interface OptionsHandler<TValue = unknown, TOptions extends OptionsHandlerOptions = OptionsHandlerOptions> extends SelectPlugin<TOptions, TValue>
{
    //######################### properties #########################

    /**
     * Array of options that are available for displaying in select
     */
    readonly availableOptions: Signal<readonly SelectOption<TValue>[]|undefined|null>;
}
