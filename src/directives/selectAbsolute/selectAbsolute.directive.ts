import {Directive} from '@angular/core';

import {Select} from '../../components';
import {SelectOptions} from '../../interfaces';

/**
 * Directive used for setting absolute option for ng-select
 */
@Directive(
{
    selector: 'ng-select[absolute]',
})
export class SelectAbsolute<TValue = unknown>
{
    //######################### constructor #########################
    constructor(select: Select<TValue>)
    {
        select.selectOptions =
        {
            absolute: true,
        } as SelectOptions<TValue>;
    }
}
