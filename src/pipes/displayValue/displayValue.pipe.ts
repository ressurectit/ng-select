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
    protected selectBus: SelectBus<TValue> = inject(SelectBus) as SelectBus<TValue>;

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms selected option into string
     * @param option - Selected options to be transformed into text
     * @param placeholderOverride - Placeholder override to be used instead of default placeholder
     */
    public transform(option: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null, placeholderOverride: string|undefined|null = undefined): string
    {
        if(isBlank(option) || (Array.isArray(option) && !option.length))
        {
            return placeholderOverride ?? this.selectBus.selectOptions().placeholder;
        }

        if(Array.isArray(option))
        {
            return option.map(this.selectBus.selectOptions().displaySelectedValue).join(', ');
        }

        return this.selectBus.selectOptions().displaySelectedValue(option);
    }
}
