import {Signal} from '@angular/core';

import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {SelectOptionState} from '../../selectOptionState/selectOptionState.interface';

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
     * Array of options that are available for processing
     */
    readonly availableOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null>;

    /**
     * Array of options that are available for listing/displaying
     */
    readonly listOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null>;
}
