import {Signal, TemplateRef} from '@angular/core';

/**
 * Option group for Select
 */
export interface SelectOptionGroup
{
    /**
     * Index of the option group in the list of options
     */
    index: number;

    /**
     * Optional template to be used for rendering option group
     */
    template: Signal<TemplateRef<{$implicit: string}>|undefined|null>;

    /**
     * Unique id of group
     */
    readonly id: string;

    /**
     * Text that is displayed for this options group
     */
    text: Signal<string>;
}
