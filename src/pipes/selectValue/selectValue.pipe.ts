import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {SelectOption} from '../../interfaces';
import {DisplayTextFunc} from '../../misc/types';

/**
 * Pipe to transform select selected option into
 */
@Pipe({name: 'selectValue'})
export class SelectValuePipe<TValue = unknown> implements PipeTransform
{
    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms selected option into string
     * @param option - Selected options to be transformed into text
     * @param nothingSelectedText - Text displayed if nothing is selected
     * @param optionDisplayText - Function used for transformation of option into display text, defaults to text property of option
     */
    public transform(option: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null, nothingSelectedText: string, optionDisplayText: DisplayTextFunc<TValue> = option => option.text()): string
    {
        if(isBlank(option) || (Array.isArray(option) && !option.length))
        {
            return nothingSelectedText;
        }

        if(Array.isArray(option))
        {
            return option.map(optionDisplayText).join(', ');
        }

        return optionDisplayText(option);
    }
}
