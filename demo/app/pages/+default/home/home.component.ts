import {Component, ChangeDetectionStrategy, Signal, viewChild, effect, signal} from '@angular/core';
import {FormField, disabled, form} from '@angular/forms/signals';
import {ComponentRedirectRoute, ComponentRoute} from '@anglr/common/router';
import {Select, Option, SelectFormControl, SelectEdit} from '@anglr/select';
import {getValue} from '@anglr/select/extensions';
import {WithScrollableCssClass} from '@anglr/common';

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
        SelectEdit,
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

    protected value = form(signal(12789), path => disabled(path, () => false));

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
