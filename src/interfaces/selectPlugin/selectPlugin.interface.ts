import {ElementRef} from '@angular/core';

import {SelectPluginInstances} from '../selectPluginInstances/selectPluginInstances.interface';

/**
 * Select plugin interface
 */
export interface SelectPlugin<TOptions = unknown, TValue = unknown>
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
    pluginBus: PluginBus<TValue>;

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    initialize(): void;

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    initOptions(): void;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}
