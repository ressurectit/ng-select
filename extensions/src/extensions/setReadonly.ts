import {SelectAction, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

/**
 * Sets Select as readonly, non editable
 * @param readonly - Indication whether is select readonly or not, if omitted defaults to true
 */
export function setReadonly<TValue, TCssClasses>(readonly: boolean = true): SelectAction<TValue, TCssClasses>
{
    return select =>
    {
        const options: RecursivePartial<SelectOptions<TValue, TCssClasses>> =
        {
            readonly: readonly,
        };

        select.selectOptions = options as SelectOptions<TValue, TCssClasses>;
    };
}
