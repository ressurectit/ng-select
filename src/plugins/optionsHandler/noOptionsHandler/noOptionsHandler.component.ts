import {ChangeDetectionStrategy, Component, computed, Inject, Optional, Signal} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {OptionsHandler, SelectOptionState, OptionsHandlerOptions} from '../../../interfaces';
import {CopyOptionsAsSignal} from '../../../decorators';
import {OPTIONS_HANDLER_OPTIONS} from '../../../misc/tokens';
import {OptionsHandlerBase} from '../optionsHandlerBase';

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
export class NoOptionsHandler<TValue = unknown> extends OptionsHandlerBase<TValue, OptionsHandlerOptions<TValue>> implements OptionsHandler<TValue, OptionsHandlerOptions<TValue>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: OptionsHandlerOptions<TValue>;

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
        super();

        this.options = deepCopyWithArrayOverride(defaultOptions as OptionsHandlerOptions<TValue>,
                                                 options);

        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() =>
        {
            const firstOption = this.firstOption();
            const availableOptions = this.availableOptions() as SelectOptionState<TValue>[] | null | undefined;

            if(firstOption && availableOptions)
            {
                availableOptions.unshift(firstOption);
            }

            return availableOptions;
        });
    }
}
