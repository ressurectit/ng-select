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

    /**
     * Indication that add new option only when there are no options available
     */
    newOptionOnlyWhenNoOptions: boolean;
}

/**
 * Options handler plugin interface
 */
export interface OptionsHandler<TValue = unknown, TPublicValue = TValue, TOptions extends OptionsHandlerOptions<TValue> = OptionsHandlerOptions<TValue>> extends SelectPlugin<TOptions, TValue, TPublicValue>
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
