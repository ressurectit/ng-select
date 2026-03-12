import {ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, Signal} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {OptionsHandler, SelectOptionState, OptionsHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {OPTIONS_HANDLER_OPTIONS} from '../../../misc/tokens';

const defaultOptions: OptionsHandlerOptions<unknown> =
{
    newOptionGetter: undefined,
};

/**
 * Options handler that does nothing to obtained options, use them as they are
 */
@Component(
{
    selector: 'no-options-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoOptionsHandler<TValue = unknown> implements OptionsHandler<TValue, OptionsHandlerOptions<TValue>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: OptionsHandlerOptions<TValue>;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### public properties - implementation of OptionsHandler #########################

    /**
     * @inheritdoc
     */
    public readonly availableOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null>;

    /**
     * @inheritdoc
     */
    public readonly listOptions: Signal<readonly SelectOptionState<TValue>[]|undefined|null>;

    //######################### constructor #########################
    constructor(@Inject(OPTIONS_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<OptionsHandlerOptions<TValue>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as OptionsHandlerOptions<TValue>,
                                                 options);

        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() => this.availableOptions());
    }
}
