import {NgSelectFunction} from '../../components/select';
import {ValueHandler} from '../../plugins/valueHandler';
import {VALUE_HANDLER} from '../../plugins/valueHandler/types';

/**
 * Gets current value of NgSelect
 * @internal
 */
export function ɵGetValue<TValue>(): NgSelectFunction<TValue|TValue[], TValue>
{
    return ngSelect =>
    {
        const valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        return valueHandler.value;
    };
}