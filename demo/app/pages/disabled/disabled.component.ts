import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {disabled, form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectFormControl} from '@anglr/select';

/**
 * Component used for displaying disabled select demo
 */
@Component(
{
    selector: 'disabled-view',
    templateUrl: 'disabled.component.html',
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
export default class DisabledComponent
{
    //######################### protected properties - template bindings #########################

    /**
     * Form value
     */
    protected value = form(signal<string|null>(null), path => disabled(path, () => this.disabled()));

    /**
     * Indication whether is select disabled
     */
    protected disabled = signal(false);
}
