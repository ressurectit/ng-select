import {Route} from '@angular/router';

/**
 * Route for live search component
 */
export const liveSearchRoute: Route =
{
    path: 'live-search',
    loadComponent: () => import('./liveSearch.component'),
};
