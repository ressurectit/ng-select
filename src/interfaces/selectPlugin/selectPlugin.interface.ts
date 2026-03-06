import {ElementRef} from '@angular/core';

import {SelectBus, SelectPluginInstances} from '../../misc/classes';

/**
 * Select plugin interface
 */
export interface SelectPlugin<TOptions = unknown, TValue = unknown, TAction = string>
{
    /**
     * Select plugin instances available for this plugin
     */
    selectPlugins: SelectPluginInstances;

    /**
     * Element that represents plugin
     */
    pluginElement: ElementRef<HTMLElement>;

    /**
     * Options for Select plugin
     */
    options: TOptions;

    /**
     * Select bus used in Select for comunication between plugins and Select
     */
    selectBus: SelectBus<TValue, TAction>;
}
