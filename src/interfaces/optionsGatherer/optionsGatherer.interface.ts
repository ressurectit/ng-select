import {Signal} from '@angular/core';

import {SelectOption} from '../selectOption/selectOption.interface';

/**
 * Gatherer used for obtaining options for select
 */
export interface OptionsGatherer<TValue = unknown>
{
    /**
     * Array of all available options for select
     */
    readonly availableOptions: Signal<SelectOption<TValue>[]|undefined|null>;
}
