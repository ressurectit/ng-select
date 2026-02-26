import {Provider, EnvironmentProviders} from '@angular/core';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {providePosition, provideLoggerConfig, DeveloperConsoleSink, LogLevelEnricher, TimestampEnricher, LogLevel, progressInterceptor} from '@anglr/common';
import {FloatingUiDomPosition} from '@anglr/common/floating-ui';

import {routes} from './app.component.routes';

/**
 * Array of providers that are used in app module
 */
export const appProviders: (Provider|EnvironmentProviders)[] =
[
    //######################### ROUTER #########################
    provideRouter(routes,
                  withComponentInputBinding()),

    //######################### CLIENT HYDRATION #########################
    provideClientHydration(),

    //######################### HTTP CLIENT #########################
    provideHttpClient(withInterceptors([progressInterceptor])),

    //######################### LOGGER #########################
    provideLoggerConfig(config => config
        .writeTo(DeveloperConsoleSink)
        .enrichWith(LogLevelEnricher)
        .enrichWith(TimestampEnricher)
        .minimumLevel(LogLevel.Information)
        .messageTemplate('{{timestamp}} [{{logLevel}}] {{messageLog}}')),

    //######################### POSITION #########################
    providePosition(FloatingUiDomPosition),
];
