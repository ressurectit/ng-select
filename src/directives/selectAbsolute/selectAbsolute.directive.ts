import {Directive} from '@angular/core';

import {SelectOptions} from '../../interfaces';
import {Select} from '../../components/select/select.component';

/**
 * Directive used for setting absolute option for ng-select
 */
@Directive(
{
    selector: 'ng-select[absolute]',
})
export class SelectAbsolute<TValue = unknown, TPublicValue = TValue>
{
    //######################### constructor #########################
    constructor(select: Select<TValue, TPublicValue>)
    {
        select.selectOptions =
        {
            absolute: true,
        } as SelectOptions<TValue, TPublicValue>;
    }
}
