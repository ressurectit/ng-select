import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, Inject, inject, Optional, Signal, untracked} from '@angular/core';
import {isBlank, isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {OptionsHandler, SelectOptionState, ValueHandler, ValueHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {VALUE_HANDLER_OPTIONS} from '../../../misc/tokens';
import {compareValueAndOption} from '../../../misc/utils';

const defaultOptions: ValueHandlerOptions =
{
};

/**
 * Value handler for static values. That means all values are available right away statically.
 */
@Component(
{
    selector: 'static-value-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticValueHandler<TValue = unknown> implements ValueHandler<TValue, ValueHandlerOptions>
{
    //######################### protected fields #########################

    /**
     * Postponed value that will be set when options are loaded. This is needed for case when value is set before options are loaded, so we cannot set value right away, but we will handle setting value when options are loaded
     */
    protected postponedValue: TValue|TValue[]|undefined|null = null;

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: ValueHandlerOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus) as SelectBus<TValue>;

    //######################### public properties - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public readonly value: Signal<TValue|TValue[]|undefined|null> = computed(() =>
    {
        const selected = this.selectBus.selectedOptions();
        const valueExtractor = this.selectBus.selectOptions().valueExtractor;

        if(isBlank(selected))
        {
            return selected;
        }

        if(Array.isArray(selected))
        {
            return selected.map(option => valueExtractor(option));
        }

        return valueExtractor(selected);
    });

    //######################### constructor #########################
    constructor(@Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<ValueHandlerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as ValueHandlerOptions,
                                                 options);

        effect(() =>
        {
            const availableOptions = (this.selectPlugins.OptionsHandler as OptionsHandler<TValue>).availableOptions();

            if(isPresent(availableOptions) && isPresent(this.postponedValue))
            {
                this.setValueInternal(this.postponedValue, availableOptions);
                this.postponedValue = null;
            }
        });
    }

    //######################### public methods - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    public initialize(): void
    {
    }

    /**
     * @inheritdoc
     */
    public initOptions(): void
    {
    }

    //######################### public methods - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public setValue(value: TValue|TValue[]|undefined|null): void
    {
        const availableOptions = untracked(() => (this.selectPlugins.OptionsHandler as OptionsHandler<TValue>).availableOptions());

        //Options are not loaded yet, so we cannot set value, but we will handle setting value when options are loaded
        if(isBlank(availableOptions))
        {
            this.postponedValue = value;

            return;
        }

        this.setValueInternal(value, availableOptions);
    }

    //######################### protected methods #########################

    /**
     * Handles setting value when options are loaded
     * @param value - Value to be set
     * @param availableOptions - Available options that are checked whether they contain value that is being set, so we can set value only if it is available in options
     */
    protected setValueInternal(value: TValue|TValue[]|undefined|null, availableOptions: readonly SelectOptionState<TValue>[]): void
    {
        //this keeps only values that are available in options
        untracked(() =>
        {
            if(this.selectBus.selectOptions().multiple)
            {
                if(!Array.isArray(value))
                {
                    throw new Error('Value must be an array when multiple is set');
                }

                const selectedOptions: SelectOptionState<TValue>[] = [];

                for(const val of value)
                {
                    const option = availableOptions.find(opt => compareValueAndOption(val, opt, this.selectBus));

                    if(option)
                    {
                        selectedOptions.push(option);
                    }
                }

                this.selectBus.selectedOptions.set(selectedOptions);
            }
            else
            {
                const selectedOption = availableOptions.find(opt => compareValueAndOption(value as TValue, opt, this.selectBus));

                this.selectBus.selectedOptions.set(selectedOption ?? null);
            }
        });
    }
}
