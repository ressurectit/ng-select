import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectFormControl} from '@anglr/select';

/**
 * Component used for displaying basic select demo
 */
@Component(
{
    selector: 'basic-view',
    templateUrl: 'basic.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@WithScrollableCssClass()
export default class BasicComponent
{
    //######################### protected properties - template bindings #########################

    /**
     * Form value
     */
    protected value = form(signal<string|null>(null));
}
