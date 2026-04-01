import {Component, ChangeDetectionStrategy, Signal, viewChild, effect, signal} from '@angular/core';
import {FormField, form} from '@angular/forms/signals';
import {ComponentRedirectRoute, ComponentRoute} from '@anglr/common/router';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectAbsolute, SelectFormControl} from '@anglr/select';
import {getValue} from '@anglr/select/extensions';

import {SelectApi} from '../../../../../src/interfaces';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    imports:
    [
        Select,
        Option,
        FormField,
        SelectAbsolute,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home'})
@WithScrollableCssClass()
export class HomeComponent
{
    protected select: Signal<SelectApi> = viewChild.required(Select);

    protected value = form(signal([]));

    constructor()
    {
        effect(() =>
        {
            if(this.select().initialized())
            {
                console.log(this.select().executeAndReturn(getValue()));
            }
        });
    }

    protected log(val: any): void
    {
        console.log(val);
    }
}
