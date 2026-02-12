import {Directive} from '@angular/core';

import {Select} from '../../components';

/**
 * Directive used for setting absolute option for ng-select
 */
@Directive(
{
    selector: 'ng-select[absolute]',
})
export class SelectAbsoluteDirective
{
    //######################### constructor #########################
    constructor(select: Select)
    {
        select.selectOptions =
        {
            absolute: true,
        };
    }
}
