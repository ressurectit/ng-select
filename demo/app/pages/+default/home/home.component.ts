import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRedirectRoute, ComponentRoute} from '@anglr/common/router';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option} from '@anglr/select';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    standalone: true,
    imports:
    [
        Select,
        Option,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home'})
@WithScrollableCssClass()
export class HomeComponent
{
}
