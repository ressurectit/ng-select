import {Route} from '@angular/router';

/**
 * Route for lazy component
 */
export const lazyRoute: Route =
{
    path: 'lazy',
    loadComponent: () => import('./lazy.component'),
};
