import {SelectFunction, SelectPluginType} from '@anglr/select';

/**
 * Gets current search value of Select (LiveSearch plugin), its reactive
 */
export function getSearch<TValue, TCssClasses>(): SelectFunction<string, TValue, TCssClasses>
{
    return select =>
    {
        if(!select.initialized())
        {
            return '';
        }

        const liveSearch = select.getPlugin(SelectPluginType.LiveSearch);

        return liveSearch.search();
    };
}
