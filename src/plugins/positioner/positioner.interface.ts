import {EventEmitter} from '@angular/core';
import {PositionOptions} from '@anglr/common';

import {PluginOptions, NgSelectPlugin} from '../../misc';

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
    /**
     * Options used for positioning
     */
    positionOptions?: Partial<Omit<PositionOptions, 'mouseEvent'|'autoUpdate'|'flip'>>;
}

/**
 * Positioner plugin interface
 */
export interface Positioner extends NgSelectPlugin
{
    /**
     * Occurs when flip occured during positining of popup
     */
    readonly flip: EventEmitter<void>;
}