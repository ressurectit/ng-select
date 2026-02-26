import {Component, ElementRef, Inject, inject, Optional, Signal, signal, WritableSignal} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {SelectOption, ValueHandler, ValueHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {VALUE_HANDLER_OPTIONS} from '../../../misc/tokens';

const defaultOptions: ValueHandlerOptions =
{
    valueExtractor: (option: SelectOption) => option.value,
};

/**
 * Value handler for static values. That means all values are available right away statically.
 */
@Component(
{
    selector: 'static-value-handler',
    template: '',
})
export class StaticValueHandler<TValue = unknown> implements ValueHandler<TValue, ValueHandlerOptions<TValue>>
{
    //######################### protected fields #########################

    /**
     * Current selected options of Select
     */
    protected selectedSignal: WritableSignal<SelectOption<TValue>|SelectOption<TValue>[]|undefined|null> = signal(null);

    /**
     * Current selected value of Select
     */
    protected valueSignal: WritableSignal<TValue|TValue[]|undefined|null> = signal(null);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: ValueHandlerOptions<TValue>;

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
    public pluginBus: SelectBus<TValue> = inject(SelectBus);

    //######################### public properties - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public get selected(): Signal<SelectOption<TValue>|SelectOption<TValue>[]|undefined|null>
    {
        return this.selectedSignal.asReadonly();
    }

    /**
     * @inheritdoc
     */
    public get value(): Signal<TValue|TValue[]|undefined|null>
    {
        return this.valueSignal.asReadonly();
    }

    //######################### constructor #########################
    constructor(@Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<ValueHandlerOptions<TValue>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as ValueHandlerOptions<TValue>,
                                                 options);
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
        this.valueSignal.set(value);
    }
}
