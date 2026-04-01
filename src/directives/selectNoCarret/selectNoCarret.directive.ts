import {Directive} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {EditNormalStateOptions, SelectOptions} from '../../interfaces';
import {Select} from '../../components/select/select.component';

/**
 * Directive used for hiding carret on Select (normal state)
 */
@Directive(
{
    selector: 'ng-select[noCarret]',
})
export class SelectNoCarret<TValue = unknown>
{
    //######################### constructor #########################
    constructor(select: Select<TValue>)
    {
        select.selectOptions =
        {
            plugins:
            {
                normalState:
                {
                    options: <RecursivePartial<EditNormalStateOptions>>
                    {
                        carret: false,
                    },
                },
            },
        } as SelectOptions<TValue>;
    }
}
