import {signal, Signal, WritableSignal} from '@angular/core';

import {OptionsGatherer, SelectOption, SelectOptionState} from '../../../interfaces';

/**
 * Options gatherer used for obtaining select options from code
 */
export class CodeOptionsGatherer<TValue = unknown> implements OptionsGatherer<TValue>
{
    //######################### protected fields #########################

    /**
     * Array of all available options for select
     */
    protected availableOptionsSignal: WritableSignal<readonly SelectOptionState<TValue>[]|null|undefined> = signal(null);

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * @inheritdoc
     */
    public get availableOptions(): Signal<readonly SelectOptionState<TValue>[]|null|undefined>
    {
        return this.availableOptionsSignal.asReadonly();
    }

    //######################### public methods #########################

    /**
     * Sets available options
     * @param options - Options to be set
     */
    public setAvailableOptions(options: readonly SelectOption<TValue>[]): void
    {
        const availableOptions = [] as SelectOptionState<TValue>[];

        for(const option of options)
        {
            const opt: SelectOptionState<TValue> = option as SelectOptionState<TValue>;

            opt.active = signal(false);
            opt.selected = signal(false);

            availableOptions.push(opt);
        }

        this.availableOptionsSignal.set(availableOptions);
    }
}
