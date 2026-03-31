import {WritableSignal} from '@angular/core';

import {SelectOption} from '../selectOption/selectOption.interface';

/**
 * Option for Select with information about its state
 */
export interface SelectOptionState<TValue = unknown> extends SelectOption<TValue>
{
    /**
     * Index of the option in the list of options
     */
    index: number;

    /**
     * Indication whether is item active
     */
    active: WritableSignal<boolean>;

    /**
     * Indication whether is this option selected
     */
    selected: WritableSignal<boolean>;
}
