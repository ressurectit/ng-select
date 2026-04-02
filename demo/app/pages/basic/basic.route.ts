import {Route} from '@angular/router';

/**
 * Route for basic component
 */
export const basicRoute: Route =
{
    path: 'basic',
    loadComponent: () => import('./basic.component'),
};
