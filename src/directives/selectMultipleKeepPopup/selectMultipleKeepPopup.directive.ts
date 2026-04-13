import {Directive} from '@angular/core';

import {Select} from '../../components/select/select.component';

/**
 * Directive that keeps popup open when multiple is set for Select
 */
@Directive(
{
    selector: 'ng-select[multiple]',
})
export class SelectMultipleKeepPopup<TValue = unknown, TPublicValue = TValue>
{
    //######################### constructor #########################
    constructor(select: Select<TValue, TPublicValue>)
    {
        select.selectOptions.closeOnSelect = false;
    }
}
