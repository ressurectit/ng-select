import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRedirectRoute, ComponentRoute} from '@anglr/common/router';
import {DebugDataCopyClickModule} from '@anglr/common/material';
import {WithScrollableCssClass} from '@anglr/common';
import {SelectModule} from '@anglr/select';

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
        SelectModule,
        DebugDataCopyClickModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home'})
@WithScrollableCssClass()
export class HomeComponent
{
}
