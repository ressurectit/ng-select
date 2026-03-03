import {Directive, effect, input, InputSignal} from '@angular/core';

import {Select} from '../../components';
import {SelectOptions} from '../../interfaces';

/**
 * Directive used for setting live search placeholder text
 */
@Directive(
{
    selector: 'ng-select[placeholder]',
})
export class SelectPlaceholder<TValue = unknown>
{
    //######################### public properties - inputs #########################

    /**
     * Placeholder text used for Select
     */
    public placeholder: InputSignal<string> = input.required();

    //######################### constructor #########################
    constructor(select: Select<TValue>)
    {
        effect(() =>
        {
            select.selectOptions =
            {
                placeholder: this.placeholder(),
            } as SelectOptions<TValue>;
        });
    }
}
