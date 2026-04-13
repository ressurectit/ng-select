import {SelectAction, SelectPluginType} from '@anglr/select';

/**
 * Sets value of Select
 * @param value - Value to be set into select
 */
export function setValue<TValue, TPublicValue, TCssClasses>(value: TPublicValue|TPublicValue[]|undefined|null): SelectAction<TValue, TPublicValue, TCssClasses>
{
    return select =>
    {
        if(!select.initialized())
        {
            return;
        }

        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        valueHandler.setValue(value);
    };
}
