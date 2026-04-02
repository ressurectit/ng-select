import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectFormControl, SelectMultipleKeepPopup} from '@anglr/select';

/**
 * Component used for displaying multiple select demo
 */
@Component(
{
    selector: 'multiple-view',
    templateUrl: 'multiple.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
        SelectMultipleKeepPopup,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@WithScrollableCssClass()
export default class MultipleComponent
{
    //######################### protected properties - template bindings #########################

    /**
     * Form value
     */
    protected value = form(signal<string[]|null>([]));
}
