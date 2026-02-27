import {ElementRef} from '@angular/core';
import {PromiseOr} from '@jscrpt/common';

import {SelectBus, SelectPluginInstances} from '../../misc/classes';

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
     * Select bus used in Select for comunication between plugins and Select
     */
    selectBus: SelectBus<TValue>;

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    initialize(): PromiseOr<void>;

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    initOptions(): PromiseOr<void>;
}
