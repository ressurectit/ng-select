import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine} from '@angular/ssr/node';
import express from 'express';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';

import bootstrap from './app/main.server';

export function applyServerSideRendering(server: express.Express): void
{
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    // All regular routes use the Angular engine
    server.get('*', (req, res, next) => 
    {
        const {protocol, originalUrl, baseUrl, headers} = req;

        commonEngine
            .render(
            {
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers:
                [
                    {
                        provide: APP_BASE_HREF,
                        useValue: baseUrl
                    },
                ],
            })
            .then(html => res.send(html))
            .catch(err => next(err));
    });
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express 
{
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Serve static files from /browser
    server.get('*.*', express.static(browserDistFolder, 
    {
        maxAge: '1y'
    }));

    applyServerSideRendering(server);

    return server;
}
