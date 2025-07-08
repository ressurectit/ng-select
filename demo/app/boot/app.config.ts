import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HotkeyModule} from 'angular2-hotkeys';

import {appProviders} from './app.providers';

/**
 * Application configuration for browser
 */
export const appConfig: ApplicationConfig =
{
    providers:
    [
        ...appProviders,
        provideAnimations(),
        importProvidersFrom(HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true,
        })),
    ],
};
