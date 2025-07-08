import {Component, ChangeDetectionStrategy, Inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LOGGER, Logger, ProgressIndicatorModule, consoleAnimationTrigger} from '@anglr/common';
import {AppHotkeysService, HotkeysCheatsheetComponent} from '@anglr/common/hotkeys';
import {fadeInOutTrigger} from '@anglr/animations';

import {MenuModule} from '../modules';
import {loaderTrigger, routeAnimationTrigger} from './app.component.animations';

/**
 * Application root component
 */
@Component(
{
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrl: 'app.component.scss',
    standalone: true,
    imports:
    [
        RouterOutlet,
        ProgressIndicatorModule,
        MenuModule,
        HotkeysCheatsheetComponent,
    ],
    animations: [routeAnimationTrigger, fadeInOutTrigger, consoleAnimationTrigger, loaderTrigger],
    providers: [AppHotkeysService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent
{
    //######################### constructor #########################
    constructor(@Inject(LOGGER) logger: Logger,)
    {
        logger.verbose('Application is starting, main component constructed.');
    }
}
