import {Signal} from '@angular/core';

import {SelectOptionGroup} from '../selectOptionGroup/selectOptionGroup.interface';

/**
 * Option for select
 */
export interface SelectOption<TValue = unknown>
{
    /**
     * Value that will be used if this option will be selected
     */
    value: Signal<TValue|undefined|null>;

    /**
     * Text that is displayed if this value is selected
     */
    text: Signal<string>;

    /**
     * If specified this option will be displayed in group
     */
    group: Signal<SelectOptionGroup|undefined|null>;
}

/**
 * Option for ng select
 */
export interface ɵSelectOption<TValue = unknown> extends SelectOption<TValue>
{
    /**
     * Indication whether is item active
     */
    active: Signal<boolean>;

    /**
     * Indication whether is this option selected
     */
    selected: Signal<boolean>;
}
