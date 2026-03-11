import {ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, signal, Signal, untracked} from '@angular/core';
import {isBlank, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {ValueHandler, DynamicValueHandlerOptions, SelectOptionState} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {VALUE_HANDLER_OPTIONS} from '../../../misc/tokens';
import {computedValue} from '../../../misc/utils';
import {ValueComputedFunc} from '../../../misc/types';

const defaultOptions: DynamicValueHandlerOptions =
{
    optionGetter: value =>
    {
        return {
            text: signal('please provide your optionGetter'),
            value: signal(value),
            group: signal(undefined),
        };
    },
};

/**
 * Value handler for dynamic values. That means that available values change.
 */
@Component(
{
    selector: 'dynamic-value-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicValueHandler<TValue = unknown> implements ValueHandler<TValue, DynamicValueHandlerOptions<TValue>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: DynamicValueHandlerOptions<TValue>;

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
    public readonly value: Signal<TValue|TValue[]|undefined|null> = computed((computedValue as ValueComputedFunc<TValue>).bind(this));

    //######################### constructor #########################
    constructor(@Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<DynamicValueHandlerOptions<TValue>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as DynamicValueHandlerOptions<TValue>,
                                                 options);
    }

    //######################### public methods - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public setValue(value: TValue|TValue[]|undefined|null): void
    {
        untracked(async () =>
        {
            if(isBlank(value))
            {
                this.selectBus.selectedOptions.set(null);

                return;
            }

            if(this.selectBus.selectOptions().multiple)
            {
                if(!Array.isArray(value))
                {
                    throw new Error('You have to provide an array of values if you set multiple!');
                }

                const selectedOptions: SelectOptionState<TValue>[] = [];

                for(const val of value)
                {
                    const selectedOption = await this.options.optionGetter(val);

                    if(!selectedOption)
                    {
                        continue;
                    }

                    const opt = selectedOption as SelectOptionState<TValue>;
                    opt.active = signal(false);
                    opt.selected = signal(true);

                    selectedOptions.push(opt);
                }

                this.selectBus.selectedOptions.set(selectedOptions);
            }
            else
            {
                const selectedOption = await this.options.optionGetter(value as TValue);
                const opt = selectedOption as SelectOptionState<TValue>|undefined|null;

                if(opt)
                {
                    opt.active = signal(false);
                    opt.selected = signal(true);
                }

                this.selectBus.selectedOptions.set(opt ?? null);
            }
        });
    }
}
