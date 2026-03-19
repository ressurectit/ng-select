import {Pipe, PipeTransform} from '@angular/core';

import {SelectOptionState} from '../../interfaces';

/**
 * Gets information whether is there any value selected
 */
@Pipe({name: 'hasValue'})
export class HasValue implements PipeTransform
{
    /**
     * Gets information whether is there any value selected
     * @param value - The value or values to check
     */
    public transform<TValue>(value: SelectOptionState<TValue>|SelectOptionState<TValue>[]|undefined|null): boolean
    {
        if(Array.isArray(value))
        {
            return value.length > 0;
        }

        return !!value;
    }
}
