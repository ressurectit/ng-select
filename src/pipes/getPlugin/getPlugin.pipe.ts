import {Pipe, PipeTransform} from '@angular/core';

import {SelectPluginType} from '../../misc/enums';
import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, ValueHandler, SelectPlugin} from '../../interfaces';

/**
 * Gets instance of select plugin from another plugin instance
 */
@Pipe({name: 'getPlugin'})
export class GetPlugin implements PipeTransform
{
    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Gets instance of select plugin from another plugin instance
     * @param plugin - Plugin instance from which plugin should be retrieved
     * @param pluginType - Name of plugin to be retrieved
     */
    public transform(plugin: SelectPlugin, pluginType: 'Interactions'): Interactions;
    public transform(plugin: SelectPlugin, pluginType: 'KeyboardHandler'): KeyboardHandler;
    public transform(plugin: SelectPlugin, pluginType: 'LiveSearch'): LiveSearch;
    public transform(plugin: SelectPlugin, pluginType: 'NormalState'): NormalState;
    public transform(plugin: SelectPlugin, pluginType: 'OptionsHandler'): OptionsHandler;
    public transform(plugin: SelectPlugin, pluginType: 'Popup'): Popup;
    public transform(plugin: SelectPlugin, pluginType: 'Positioner'): Positioner;
    public transform(plugin: SelectPlugin, pluginType: 'ReadonlyState'): ReadonlyState;
    public transform(plugin: SelectPlugin, pluginType: 'ValueHandler'): ValueHandler;
    public transform<PluginInstance extends SelectPlugin>(plugin: SelectPlugin, pluginType: keyof typeof SelectPluginType): PluginInstance
    {
        return plugin.selectPlugins[pluginType] as PluginInstance;
    }
}
