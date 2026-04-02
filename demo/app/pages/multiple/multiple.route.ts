import {Route} from '@angular/router';

/**
 * Route for multiple component
 */
export const multipleRoute: Route =
{
    path: 'multiple',
    loadComponent: () => import('./multiple.component'),
};
