import {Directive} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {provideLiveSearchType, provideNormalStateType} from '../../misc/providers';
import {EditLiveSearch, EditNormalState} from '../../plugins';
import {Select} from '../../components/select/select.component';
import {SelectOptions, SimpleKeyboardHandlerOptions} from '../../interfaces';

/**
 * Directive that applies options for Select which switch it to edit mode.
 */
@Directive(
{
    selector: 'ng-select[edit]',
    providers:
    [
        provideNormalStateType(EditNormalState),
        provideLiveSearchType(EditLiveSearch),
    ],
})
export class SelectEdit<TValue = unknown, TPublicValue = TValue>
{
    //######################### constructor #########################
    constructor(select: Select<TValue, TPublicValue>)
    {
        select.selectOptions =
        {
            plugins:
            {
                keyboardHandler:
                {
                    options: <RecursivePartial<SimpleKeyboardHandlerOptions>>
                    {
                        alphanumericSearch: false,
                        liveSearchEvents: true,
                    },
                },
            },
        } as SelectOptions<TValue, TPublicValue>;
    }
}
