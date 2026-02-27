import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {VisualPluginOptions} from '../../visualPluginOptions/visualPluginOptions.interface';

/**
 * CSS classes for normal state plugin
 */
export interface NormalStateCssClasses
{
}

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses extends NormalStateCssClasses = NormalStateCssClasses> extends VisualPluginOptions<TCssClasses>
{
}

/**
 * Normal state plugin interface
 */
export interface NormalState<TValue = unknown, TOptions extends NormalStateOptions = NormalStateOptions> extends SelectPlugin<TOptions, TValue>
{
}
