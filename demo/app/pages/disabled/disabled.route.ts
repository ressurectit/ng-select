import {Route} from '@angular/router';

/**
 * Route for disabled component
 */
export const disabledRoute: Route =
{
    path: 'disabled',
    loadComponent: () => import('./disabled.component'),
};
