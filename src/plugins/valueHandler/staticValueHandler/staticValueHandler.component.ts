import {Component, computed, ElementRef, Inject, inject, Optional, Signal} from '@angular/core';
import {isBlank, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {ValueHandler, ValueHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {VALUE_HANDLER_OPTIONS} from '../../../misc/tokens';

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
})
export class StaticValueHandler<TValue = unknown> implements ValueHandler<TValue, ValueHandlerOptions>
{
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
    public pluginBus: SelectBus<TValue> = inject(SelectBus);

    //######################### public properties - implementation of ValueHandler #########################

    /**
     * @inheritdoc
     */
    public readonly value: Signal<TValue|TValue[]|undefined|null> = computed(() =>
    {
        const selected = this.pluginBus.selectedOptions();
        const valueExtractor = this.pluginBus.selectOptions().valueExtractor;

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
    public setValue(_value: TValue|TValue[]|undefined|null): void
    {
    }
}
