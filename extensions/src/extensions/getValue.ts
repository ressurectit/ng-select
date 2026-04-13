import {SelectFunction, SelectPluginType} from '@anglr/select';

/**
 * Gets current value of Select, its reactive
 */
export function getValue<TValue, TPublicValue, TCssClasses>(): SelectFunction<TPublicValue|TPublicValue[]|undefined|null, TValue, TPublicValue, TCssClasses>
{
    return select =>
    {
        if(!select.initialized())
        {
            return undefined;
        }

        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        return valueHandler.value();
    };
}
