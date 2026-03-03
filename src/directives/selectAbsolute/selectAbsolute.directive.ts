import {Directive} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {Select} from '../../components';
import {SelectCssClasses, SelectOptions} from '../../interfaces';

/**
 * Directive used for setting absolute option for ng-select
 */
@Directive(
{
    selector: 'ng-select[absolute]',
})
export class SelectAbsoluteDirective<TValue = unknown>
{
    //######################### constructor #########################
    constructor(select: Select<TValue>)
    {
        select.selectOptions =
        <RecursivePartial<SelectOptions<TValue, SelectCssClasses>>>
        {
            absolute: true,
        } as SelectOptions<TValue, SelectCssClasses>;
    }
}
