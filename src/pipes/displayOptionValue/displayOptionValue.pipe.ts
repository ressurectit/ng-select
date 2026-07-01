import {computed, inject, Pipe, PipeTransform, Signal} from '@angular/core';
import {LOGGER, Logger} from '@anglr/common';

import {SelectOption} from '../../interfaces';
import {SelectBus} from '../../misc/classes';
import {DisplayTextFunc} from '../../misc/types';

/**
 * Pipe to transform select option into string
 */
@Pipe({name: 'displayOptionValue', pure: false})
export class DisplayOptionValue<TValue = unknown> implements PipeTransform
{
    //######################### protected fields #########################

    /**
     * Select bus used in Select for comunication between plugins and Select
     */
    protected selectBus: SelectBus<TValue> = inject<SelectBus<TValue>>(SelectBus);

    /**
     * Logger used for logging in this pipe
     */
    protected logger: Logger = inject(LOGGER);

    /**
     * Last option provided to transform function, used for optimization of transform function to prevent unnecessary calculations in case the same option is provided again
     */
    protected lastOption: SelectOption<TValue>|Array<SelectOption<TValue>>|undefined|null;

    /**
     * Computed value of the transform function, used for optimization to prevent unnecessary calculations
     */
    protected computedValue: Signal<string>|undefined|null;

    /**
     * Function used for obtaining display value of option, used for transforming option into string
     */
    protected displayOptionValue: Signal<DisplayTextFunc<TValue>> = computed(() => this.selectBus.selectOptions().displayOptionValue ?? this.selectBus.selectOptions().displaySelectedValue);

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms option into string
     * @param option - Option to be transformed into text
     */
    public transform(option: SelectOption<TValue>): string
    {
        if(this.lastOption !== option)
        {
            this.lastOption = option;

            this.computedValue = computed(() =>
            {
                this.logger.verbose('Select: DisplayOptionValue: transforming selected options {{@(4)options}}', {options: option});

                const displayOptionValue = this.displayOptionValue();

                return displayOptionValue(option);
            });
        }

        return this.computedValue?.() ?? '';
    }
}
