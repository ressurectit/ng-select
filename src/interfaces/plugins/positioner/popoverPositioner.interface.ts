import {PositionerOptions} from './positioner.interface';

/**
 * Options for popover positioner plugin
 */
export interface PopoverPositionerOptions extends PositionerOptions
{
    //######################### properties #########################

    /**
     * Indication whether popover property should be set to 'auto' or 'manual'
     */
    popoverAuto: boolean;
}
