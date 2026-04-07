import {Route} from '@angular/router';

/**
 * Route for dynamic component
 */
export const dynamicRoute: Route =
{
    path: 'dynamic',
    loadComponent: () => import('./dynamic.component'),
};
