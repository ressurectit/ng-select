import {ApplicationConfig, importProvidersFrom} from '@angular/core';
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
        importProvidersFrom(HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true,
        })),
    ],
};
