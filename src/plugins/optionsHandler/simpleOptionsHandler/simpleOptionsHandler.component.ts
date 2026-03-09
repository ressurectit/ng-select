import {ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, Signal} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {OptionsHandler, SelectOptionState, SimpleOptionsHandlerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {OPTIONS_HANDLER_OPTIONS} from '../../../misc/tokens';
import {compareSelectOptions} from '../../../misc/utils';

const defaultOptions: SimpleOptionsHandlerOptions =
{
    listSelected: true,
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
export class SimpleOptionsHandler<TValue = unknown> implements OptionsHandler<TValue, SimpleOptionsHandlerOptions>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: SimpleOptionsHandlerOptions;

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
    constructor(@Inject(OPTIONS_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<SimpleOptionsHandlerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as SimpleOptionsHandlerOptions,
                                                 options);

        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() =>
        {
            const text = this.selectPlugins.LiveSearch.search();
            const options = this.selectBus.selectOptions();
            const selectedOptions = this.selectBus.selectedOptions() ?? [];
            const opts = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
            let availableOptions = this.availableOptions();
            const textExtractor = options.textExtractor;
            const normalize = options.normalize;
            const textCompare = options.textCompare;

            if(!this.options.listSelected)
            {
                availableOptions = availableOptions?.filter(itm =>
                {
                    return !opts.some(it => compareSelectOptions(it, itm, this.selectBus));
                });
            }

            if(!text)
            {
                return availableOptions;
            }

            return availableOptions
                ?.filter(itm => textCompare(normalize(textExtractor(itm)), normalize(text)));
        });
    }
}
