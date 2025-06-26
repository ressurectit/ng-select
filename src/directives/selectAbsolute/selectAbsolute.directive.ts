import {Directive} from '@angular/core';

import {SelectComponent} from '../../components';

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
    constructor(select: SelectComponent)
    {
        select.selectOptions =
        {
            absolute: true,
        };
    }
}
