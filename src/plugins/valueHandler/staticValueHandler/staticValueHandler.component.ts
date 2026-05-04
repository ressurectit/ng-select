import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, Inject, inject, Optional, signal, Signal, untracked, WritableSignal} from '@angular/core';
import {LOGGER, Logger} from '@anglr/common';
import {isBlank, isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {SelectOptionState, ValueHandler, ValueHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {VALUE_HANDLER_OPTIONS} from '../../../misc/tokens';
import {compareValueAndOption, computedValue} from '../../../misc/utils';
import {ValueComputedFunc} from '../../../misc/types';

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
export class StaticValueHandler<TValue = unknown, TPublicValue = TValue> implements ValueHandler<TValue, TPublicValue, ValueHandlerOptions>
{
    //######################### protected fields #########################

    /**
     * Postponed value that will be set when options are loaded. This is needed for case when value is set before options are loaded, so we cannot set value right away, but we will handle setting value when options are loaded
     */
    protected postponedValue: WritableSignal<TPublicValue|TPublicValue[]|undefined|null> = signal(null);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: ValueHandlerOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue, TPublicValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue, TPublicValue> = inject(SelectBus);

    /**
     * Instance of logger for logging purposes
     */
    protected logger: Logger = inject(LOGGER);

    //######################### public properties - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public readonly value: Signal<TPublicValue|TPublicValue[]|undefined|null> = computed(() => this.postponedValue() ?? (computedValue as ValueComputedFunc<TPublicValue>).bind(this)());

    //######################### constructor #########################
    constructor(@Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<ValueHandlerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as ValueHandlerOptions,
                                                 options);

        effect(() =>
        {
            const availableOptions = this.selectPlugins.OptionsHandler.availableOptions();
            const postponedValue = untracked(() => this.postponedValue());

            if(isPresent(availableOptions) && isPresent(postponedValue))
            {
                this.logger.verbose('Select: Value handler: setting postponed value "{{@(4)value}}"', {value: postponedValue});

                this.setValueInternal(postponedValue, availableOptions);
                this.postponedValue.set(null);
            }
        });
    }

    //######################### public methods - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public setValue(value: TPublicValue|TPublicValue[]|undefined|null): void
    {
        this.logger.verbose('Select: Value handler: setting value "{{@(4)value}}"', {value});
        const availableOptions = untracked(() => this.selectPlugins.OptionsHandler.availableOptions());

        //Options are not loaded yet, so we cannot set value, but we will handle setting value when options are loaded
        if(isBlank(availableOptions))
        {
            this.logger.verbose('Select: Value handler: options not loaded yet, postponing value "{{@(4)value}}"', {value});
            this.postponedValue.set(value);

            return;
        }

        this.postponedValue.set(null);
        this.setValueInternal(value, availableOptions);
    }

    //######################### protected methods #########################

    /**
     * Handles setting value when options are loaded
     * @param value - Value to be set
     * @param availableOptions - Available options that are checked whether they contain value that is being set, so we can set value only if it is available in options
     */
    protected setValueInternal(value: TPublicValue|TPublicValue[]|undefined|null, availableOptions: readonly SelectOptionState<TValue>[]): void
    {
        //this keeps only values that are available in options
        untracked(() =>
        {
            const selected = this.selectBus.selectedOptions();

            if(Array.isArray(selected))
            {
                for(const option of selected)
                {
                    option.selected.set(false);
                }
            }
            else if(isPresent(selected))
            {
                selected.selected.set(false);
            }

            if(this.selectBus.selectOptions().multiple)
            {
                if(isBlank(value))
                {
                    this.logger.verbose('Select: Value handler: value is blank, clearing selected options');

                    this.selectBus.selectedOptions.set([]);

                    return;
                }

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
                        option.selected.set(true);
                        selectedOptions.push(option);
                    }
                }

                this.logger.verbose('Select: Value handler: selecting multiple options value "{{@(4)value}}"', {value: selectedOptions});
                this.selectBus.selectedOptions.set(selectedOptions);
            }
            else
            {
                const selectedOption = availableOptions.find(opt => compareValueAndOption(value as TPublicValue, opt, this.selectBus));
                selectedOption?.selected.set(true);
                this.logger.verbose('Select: Value handler: selecting single option value "{{@(4)value}}"', {value: selectedOption?.value()});

                this.selectBus.selectedOptions.set(selectedOption ?? null);
            }
        });
    }
}
