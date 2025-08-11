import {PluginOptions} from '../../pluginOptions/pluginOptions.interface';
import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';

/**
 * Options for live search plugin
 */
export interface LiveSearchOptions extends PluginOptions
{
}

/**
 * Live search plugin interface
 */
export interface LiveSearch extends SelectPlugin
{
}
