import {SelectFunction, SelectPluginType} from '@anglr/select';

/**
 * Gets current value of Select, now its reactive
 */
export function getValue<TValue>(): SelectFunction<TValue|TValue[]|undefined|null, TValue>
{
    return select =>
    {
        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        return valueHandler.value();
    };
}
