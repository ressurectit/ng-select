import {Signal} from '@angular/core';

import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {SelectOptionState} from '../../selectOptionState/selectOptionState.interface';
import {NewOptionGetterFunc} from '../../../misc/types';

/**
 * Options for options handler plugin
 */
export interface OptionsHandlerOptions<TValue = unknown> extends PluginOptions
{
    //######################### properties #########################

    /**
     * Allows adding new option to select when defined
     */
    newOptionGetter: NewOptionGetterFunc<TValue>|undefined|null;
}

/**
 * Options handler plugin interface
 */
export interface OptionsHandler<TValue = unknown, TOptions extends OptionsHandlerOptions<TValue> = OptionsHandlerOptions<TValue>> extends SelectPlugin<TOptions, TValue>
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
