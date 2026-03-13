import {SelectOptionState} from '../selectOptionState/selectOptionState.interface';

/**
 * Option for Select with information about its state and whether it was created
 */
export interface SelectOptionStateSyntetic<TValue = unknown> extends SelectOptionState<TValue>
{
    //######################### properties #########################

    /**
     * Indication whether was this option created in Select
     */
    created?: boolean;
}
