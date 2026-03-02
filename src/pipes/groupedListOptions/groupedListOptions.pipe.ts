import {Pipe, PipeTransform} from '@angular/core';

import {SelectOptionGroup, SelectOptionState} from '../../interfaces';

interface GroupInfo<TValue = unknown>
{
    group: SelectOptionGroup|null;
    options: SelectOptionState<TValue>[];
}

/**
 * Gets list of options grouped
 */
@Pipe({name: 'groupedListOptions'})
export class GroupedListOptions<TValue = unknown> implements PipeTransform
{
    /**
     * Gets list of options grouped
     * @param value - Obtains tuple with options and their corresponding groups
     */
    public transform(value: readonly SelectOptionState<TValue>[]|null|undefined): [readonly SelectOptionState<TValue>[], SelectOptionGroup|null][]
    {
        const groups: Record<string, GroupInfo<TValue>> = {};
        const ungrouped: SelectOptionState<TValue>[] = [];

        if(!value?.length)
        {
            return [];
        }

        for(const option of value)
        {
            const group = option.group();

            if(group)
            {
                const grp = groups[group.id] ??=
                {
                    group: group,
                    options: [],
                };

                grp.options.push(option);
            }
            else
            {
                ungrouped.push(option);
            }
        }

        const result: [readonly SelectOptionState<TValue>[], SelectOptionGroup|null][] = Object.values(groups).map(g => [g.options, g.group]);

        if(ungrouped.length)
        {
            result.unshift([ungrouped, null]);
        }

        return result;
    }
}
