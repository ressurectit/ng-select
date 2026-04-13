import {Directive, effect, input, InputSignal} from '@angular/core';

import {SelectOptions} from '../../interfaces';
import {Select} from '../../components/select/select.component';

/**
 * Directive used for setting live search placeholder text
 */
@Directive(
{
    selector: 'ng-select[placeholder]',
})
export class SelectPlaceholder<TValue = unknown, TPublicValue = TValue>
{
    //######################### public properties - inputs #########################

    /**
     * Placeholder text used for Select
     */
    public placeholder: InputSignal<string> = input.required();

    //######################### constructor #########################
    constructor(select: Select<TValue, TPublicValue>)
    {
        effect(() =>
        {
            select.selectOptions =
            {
                placeholder: this.placeholder(),
            } as SelectOptions<TValue, TPublicValue>;
        });
    }
}
