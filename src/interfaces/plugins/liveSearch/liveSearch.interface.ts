import {Signal} from '@angular/core';

import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {VisualPluginOptions} from '../../visualPluginOptions/visualPluginOptions.interface';

/**
 * Css classes for live search
 */
export interface LiveSearchCssClasses
{

}

/**
 * Options for live search plugin
 */
export interface LiveSearchOptions<TCssClasses extends LiveSearchCssClasses = LiveSearchCssClasses> extends VisualPluginOptions<TCssClasses>
{
}

/**
 * Live search plugin interface
 */
export interface LiveSearch<TValue = unknown, TOptions extends LiveSearchOptions = LiveSearchOptions> extends SelectPlugin<TOptions, TValue>
{
    //######################### properties #########################

    /**
     * Text of search value
     */
    readonly search: Signal<string>;
}
