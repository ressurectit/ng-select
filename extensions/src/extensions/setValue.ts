import {SelectAction, SelectPluginType} from '@anglr/select';

/**
 * Sets value of Select
 * @param value - Value to be set into select
 */
export function setValue<TValue, TCssClasses>(value: TValue|TValue[]|undefined|null): SelectAction<TValue, TCssClasses>
{
    return select =>
    {
        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        valueHandler.setValue(value);
    };
}
