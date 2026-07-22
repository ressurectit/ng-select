import {SelectFunction, SelectOption, SelectPluginType} from '@anglr/select';

/**
 * Gets currently selected options of Select, its reactive
 */
export function getSelectedOptions<TValue, TPublicValue, TCssClasses>(): SelectFunction<SelectOption<TValue>|SelectOption<TValue>[]|undefined|null, TValue, TPublicValue, TCssClasses>
{
    return select =>
    {
        if(!select.initialized())
        {
            return undefined;
        }

        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        return valueHandler.selectBus.selectedOptions();
    };
}
