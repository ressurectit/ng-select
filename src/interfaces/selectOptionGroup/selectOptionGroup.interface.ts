import {Signal, TemplateRef} from '@angular/core';

/**
 * Option group for Select
 */
export interface SelectOptionGroup
{
    /**
     * Optional template to be used for rendering option group
     */
    template: TemplateRef<{$implicit: string}>|undefined|null;

    /**
     * Unique id of group
     */
    id: string;

    /**
     * Text that is displayed for this options group
     */
    text: Signal<string>;
}
