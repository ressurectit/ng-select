import {computed, inject, Pipe, PipeTransform, Signal} from '@angular/core';
import {LOGGER, Logger} from '@anglr/common';
import {isBlank} from '@jscrpt/common';

import {SelectOption} from '../../interfaces';
import {SelectBus} from '../../misc/classes';
import {DisplayTextFunc} from '../../misc/types';

/**
 * Pipe to transform select selected option into string
 */
@Pipe({name: 'displayValue', pure: false})
export class DisplayValue<TValue = unknown> implements PipeTransform
{
    //######################### protected fields #########################

    /**
     * Select bus used in Select for comunication between plugins and Select
     */
    protected selectBus: SelectBus<TValue> = inject(SelectBus) as SelectBus<TValue>;

    /**
     * Logger used for logging in this pipe
     */
    protected logger: Logger = inject(LOGGER);

    /**
     * Last option provided to transform function, used for optimization of transform function to prevent unnecessary calculations in case the same option is provided again
     */
    protected lastOption: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null;

    /**
     * Last placeholder override provided to transform function, used for optimization of transform function to prevent unnecessary calculations in case the same placeholder override is provided again
     */
    protected lastPlaceholderOverride: string|undefined|null;

    /**
     * Computed value of the transform function, used for optimization to prevent unnecessary calculations
     */
    protected computedValue: Signal<string>|undefined|null;

    /**
     * Placeholder for select, used in case there is no option selected
     */
    protected placeholder: Signal<string> = computed(() => this.selectBus.selectOptions().placeholder);

    /**
     * Function used for obtaining display value of option, used for transforming selected option into string
     */
    protected displaySelectedValue: Signal<DisplayTextFunc<TValue>> = computed(() => this.selectBus.selectOptions().displaySelectedValue);

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms selected option into string
     * @param option - Selected options to be transformed into text
     * @param placeholderOverride - Placeholder override to be used instead of default placeholder
     */
    public transform(option: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null, placeholderOverride: string|undefined|null = undefined): string
    {
        if(this.lastOption !== option || this.lastPlaceholderOverride !== placeholderOverride)
        {
            this.lastOption = option;
            this.lastPlaceholderOverride = placeholderOverride;

            this.computedValue = computed(() =>
            {
                this.logger.verbose('Select: DisplayValue: transforming selected options {{@(4)options}}', {options: option});

                if(isBlank(option) || (Array.isArray(option) && !option.length))
                {
                    return placeholderOverride ?? this.placeholder();
                }

                const displaySelectedValue = this.displaySelectedValue();

                if(Array.isArray(option))
                {
                    return option.map(displaySelectedValue).join(', ');
                }

                return displaySelectedValue(option);
            });
        }

        return this.computedValue?.() ?? '';
    }
}
