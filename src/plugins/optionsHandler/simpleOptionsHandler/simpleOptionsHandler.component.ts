import {ChangeDetectionStrategy, Component, computed, Inject, Optional, Signal} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {OptionsHandler, SelectOptionState, SimpleOptionsHandlerOptions} from '../../../interfaces';
import {CopyOptionsAsSignal} from '../../../decorators';
import {OPTIONS_HANDLER_OPTIONS} from '../../../misc/tokens';
import {compareSelectOptions} from '../../../misc/utils';
import {OptionsHandlerBase} from '../optionsHandlerBase';

const defaultOptions: SimpleOptionsHandlerOptions<unknown> =
{
    listSelected: true,
    newOptionGetter: undefined,
};

/**
 * Options handler that does apply live search and allows to remove selected option(s) from options list
 */
@Component(
{
    selector: 'simple-options-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleOptionsHandler<TValue = unknown> extends OptionsHandlerBase<TValue, SimpleOptionsHandlerOptions<TValue>> implements OptionsHandler<TValue, SimpleOptionsHandlerOptions<TValue>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: SimpleOptionsHandlerOptions<TValue>;

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
    constructor(@Inject(OPTIONS_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<SimpleOptionsHandlerOptions<TValue>>|null,)
    {
        super();

        this.options = deepCopyWithArrayOverride(defaultOptions as SimpleOptionsHandlerOptions<TValue>,
                                                 options);

        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() =>
        {
            const text = this.selectPlugins.LiveSearch.search();
            const selectedOptions = this.selectBus.selectedOptions() ?? [];
            const opts = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
            const firstOption = this.firstOption();
            let availableOptions = this.availableOptions() as SelectOptionState<TValue>[] | null | undefined;

            if(!this.options.listSelected)
            {
                availableOptions = availableOptions?.filter(itm =>
                {
                    return !opts.some(it => compareSelectOptions(it, itm, this.selectBus));
                });
            }

            if(!text)
            {
                if(firstOption && availableOptions)
                {
                    availableOptions.unshift(firstOption);
                }

                return availableOptions;
            }

            const options = this.selectBus.selectOptions();
            const textExtractor = options.textExtractor;
            const normalize = options.normalize;
            const textCompare = options.textCompare;

            availableOptions = availableOptions
                ?.filter(itm => textCompare(normalize(textExtractor(itm)), normalize(text)));

            if(firstOption && availableOptions)
            {
                availableOptions.unshift(firstOption);
            }

            return availableOptions;
        });
    }
}
