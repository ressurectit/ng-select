import {PositionerOptions} from './positioner.interface';

/**
 * Options for common positioner plugin
 */
export interface CommonPositionerOptions extends PositionerOptions
{
    //######################### properties #########################

    /**
     * If set tells positioner to set z-index of positioned element to this value, if not set positioner will not change z-index of element
     */
    zIndex: number|undefined|null;
}
