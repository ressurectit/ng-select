import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {SelectOption} from '../../interfaces';

/**
 * Pipe that checks whether select has currently any option
 */
@Pipe({name: 'selectHasValue'})
export class SelectHasValuePipe<TValue = unknown> implements PipeTransform
{
    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms selected option into boolean indication if there is option selected
     * @param options - Selected options to be transformed into boolean
     */
    public transform(options: SelectOption<TValue>|Array<SelectOption<TValue>>): boolean
    {
        return !(isBlank(options) || (Array.isArray(options) && !options.length));
    }
}
