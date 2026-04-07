import {Routes} from '@angular/router';
import {extractRoutes} from '@anglr/common/router';

import {accessDeniedRoute} from '../pages/accessDenied/accessDenied.route';
import {notFoundRoute} from '../pages/notFound/notFound.route';
import {basicRoute} from '../pages/basic/basic.route';
import {lazyRoute} from '../pages/lazy/lazy.route';
import {multipleRoute} from '../pages/multiple/multiple.route';
import {disabledRoute} from '../pages/disabled/disabled.route';
import {liveSearchRoute} from '../pages/liveSearch/liveSearch.route';

export const routes: Routes =
[
    {
        path: '',
        loadChildren: () => import('../pages/+default/default.module')
    },
    ...extractRoutes(
    [
    ]),
    basicRoute,
    lazyRoute,
    multipleRoute,
    disabledRoute,
    liveSearchRoute,
    accessDeniedRoute,
    notFoundRoute,
];
