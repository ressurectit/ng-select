import {Component, ChangeDetectionStrategy, signal, WritableSignal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectFormControl} from '@anglr/select';

import {KodPopisValue} from '../../misc/types';

/**
 * Component used for displaying lazy select demo
 */
@Component(
{
    selector: 'lazy-view',
    templateUrl: 'lazy.component.html',
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
export default class LazyComponent
{
    //######################### protected properties - template bindings #########################

    /**
     * Form value
     */
    protected value = form(signal<string|null>(null));

    /**
     * Array of lazy options
     */
    protected lazyOptions: WritableSignal<KodPopisValue[]> = signal([]);

    //######################### constructor #########################
    constructor()
    {
        setTimeout(() => this.lazyOptions.set(
        [
            {
                kod: 'first-x',
                popis: 'First value text',
            },
            {
                kod: 'second-x',
                popis: 'Second value text',
            },
            {
                kod: 'third-x',
                popis: 'Third value text',
            },
            {
                kod: 'fourth-x',
                popis: 'Fourth value text',
            },
            {
                kod: 'fifth-x',
                popis: 'Fifth value text',
            },
        ]), 2500);
    }
}
