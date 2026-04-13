import {SelectAction, SelectOptions} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

/**
 * Sets Select as readonly, non editable
 * @param readonly - Indication whether is select readonly or not, if omitted defaults to true
 */
export function setReadonly<TValue, TPublicValue, TCssClasses>(readonly: boolean = true): SelectAction<TValue, TPublicValue, TCssClasses>
{
    return select =>
    {
        const options: RecursivePartial<SelectOptions<TValue, TPublicValue, TCssClasses>> =
        {
            readonly: readonly,
        };

        select.selectOptions = options as SelectOptions<TValue, TPublicValue, TCssClasses>;
    };
}
