import {ElementRef} from '@angular/core';
import {Invalidatable} from '@jscrpt/common';

import {SelectPluginInstances} from '../selectPluginInstances/selectPluginInstances.interface';
import {SelectBus} from '../../misc/classes';

/**
 * Select plugin interface
 */
export interface SelectPlugin<TOptions = unknown, TValue = unknown> extends Invalidatable
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
     * Plugin bus used in select
     */
    pluginBus: SelectBus<TValue>;

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    initialize(): void;

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    initOptions(): void;
}
