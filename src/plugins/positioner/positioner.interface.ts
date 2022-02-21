import type {PositionsCoordinates} from 'positions';

import {PluginOptions, NgSelectPlugin} from '../../misc';

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
    /**
     * Coordinates of options popup relative to select
     */
    optionsCoordinates?: PositionsCoordinates;

    /**
     * Coordinates of select relative to options
     */
    selectCoordinates?: PositionsCoordinates;
}

/**
 * Positioner plugin interface
 */
export interface Positioner extends NgSelectPlugin
{
}