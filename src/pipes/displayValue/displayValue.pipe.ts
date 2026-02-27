import {inject, Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {SelectOption} from '../../interfaces';
import {SelectBus} from '../../misc/classes';

/**
 * Pipe to transform select selected option into
 */
@Pipe({name: 'displayValue'})
export class DisplayValue<TValue = unknown> implements PipeTransform
{
    //######################### protected fields #########################

    /**
     * Select bus used in Select for comunication between plugins and Select
     */
    protected selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms selected option into string
     * @param option - Selected options to be transformed into text
     */
    public transform(option: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null): string
    {
        if(isBlank(option) || (Array.isArray(option) && !option.length))
        {
            return this.selectBus.selectOptions().placeholder;
        }

        if(Array.isArray(option))
        {
            return option.map(this.selectBus.selectOptions().displaySelectedValue).join(', ');
        }

        return this.selectBus.selectOptions().displaySelectedValue(option);
    }
}
