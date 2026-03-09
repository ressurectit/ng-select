import {Component, ChangeDetectionStrategy, Signal, viewChild, effect} from '@angular/core';
import {ComponentRedirectRoute, ComponentRoute} from '@anglr/common/router';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectAbsolute} from '@anglr/select';
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
        SelectAbsolute,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home'})
@WithScrollableCssClass()
export class HomeComponent
{
    protected select: Signal<SelectApi> = viewChild.required(Select);

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
}
