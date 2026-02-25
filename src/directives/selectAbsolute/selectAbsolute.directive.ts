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
export class SelectAbsoluteDirective<TValue = unknown, TCssClasses = SelectCssClasses>
{
    //######################### constructor #########################
    constructor(select: Select<TValue, TCssClasses>)
    {
        select.selectOptions =
        <RecursivePartial<SelectOptions<TValue, TCssClasses>>>
        {
            absolute: true,
        } as SelectOptions<TValue, TCssClasses>;
    }
}
