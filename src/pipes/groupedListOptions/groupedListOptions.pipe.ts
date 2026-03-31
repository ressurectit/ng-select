import {Pipe, PipeTransform} from '@angular/core';

import {SelectOptionGroup, SelectOptionState} from '../../interfaces';

/**
 * Gets list of options grouped
 */
@Pipe({name: 'groupedListOptions'})
export class GroupedListOptions implements PipeTransform
{
    /**
     * Gets list of options grouped
     * @param value - Obtains tuple with options and their corresponding groups
     */
    public transform<TValue>(value: readonly SelectOptionState<TValue>[]|null|undefined): [[readonly SelectOptionState<TValue>[], SelectOptionGroup|null][], number]
    {
        if(!value?.length)
        {
            return [[], 0];
        }

        const result: [SelectOptionState<TValue>[], SelectOptionGroup|null][] = [];
        let index = 0;

        for(const option of value)
        {
            const group = option.group();

            if(group)
            {
                group.index = index++;
            }

            option.index = index++;

            //first one
            if(!result.length)
            {
                result.push([[option], group ?? null]);
            }
            else
            {
                const last = result[result.length - 1];

                if(last[1] === group)
                {
                    last[0].push(option);
                }
                else
                {
                    result.push([[option], group ?? null]);
                }
            }
        }

        return [result, index];
    }
}
