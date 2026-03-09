import {Signal} from '@angular/core';

import {SelectOptionState} from '../selectOptionState/selectOptionState.interface';

/**
 * Gatherer used for obtaining options for select
 */
export interface OptionsGatherer<TValue = unknown>
{
    /**
     * Array of all available options for select
     */
    readonly availableOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null>;
}
