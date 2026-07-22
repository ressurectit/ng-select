import {SelectFunction, SelectOption, SelectPluginType} from '@anglr/select';

/**
 * Gets currently selected option of Select, simplifies way how to obtain single value from select, if select is multiple, throws error, its reactive
 */
export function getSelectedOption<TValue, TPublicValue, TCssClasses>(): SelectFunction<SelectOption<TValue>|undefined|null, TValue, TPublicValue, TCssClasses>
{
    return select =>
    {
        if(!select.initialized())
        {
            return undefined;
        }

        const valueHandler = select.getPlugin(SelectPluginType.ValueHandler);

        const selectedOptions = valueHandler.selectBus.selectedOptions();

        if(Array.isArray(selectedOptions))
        {
            throw new Error('Select is multiple, cannot get single selected option');
        }

        return selectedOptions;
    };
}
