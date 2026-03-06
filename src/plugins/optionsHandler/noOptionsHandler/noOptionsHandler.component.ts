import {ChangeDetectionStrategy, Component, computed, ElementRef, inject, Signal} from '@angular/core';

import {OptionsHandler, OptionsHandlerOptions, SelectOptionState} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 * Options handler that does not modify available options in any way. It just returns them as they are provided from options gatherer
 */
@Component(
{
    selector: 'no-options-handler',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoOptionsHandler<TValue = unknown> implements OptionsHandler<TValue, OptionsHandlerOptions>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    public options: OptionsHandlerOptions = {};

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
    constructor()
    {
        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() =>
        {
            const text = this.selectPlugins.LiveSearch.search();
            const options = this.selectBus.selectOptions();
            const textExtractor = options.textExtractor;
            const normalize = options.normalize;
            const textCompare = options.textCompare;

            if(!text)
            {
                return this.availableOptions();
            }

            return this.availableOptions()?.filter(itm => textCompare(normalize(textExtractor(itm)), normalize(text)));
        });
    }
}
