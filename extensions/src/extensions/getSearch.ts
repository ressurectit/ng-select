import {SelectFunction, SelectPluginType} from '@anglr/select';

/**
 * Gets current search value of Select (LiveSearch plugin), its reactive
 */
export function getSearch(): SelectFunction<string>
{
    return select =>
    {
        const liveSearch = select.getPlugin(SelectPluginType.LiveSearch);

        return liveSearch.search();
    };
}
