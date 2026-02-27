import {Component, computed, ElementRef, inject, Signal} from '@angular/core';

import {OptionsHandler, OptionsHandlerOptions, SelectOption} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 * Options handler that does not modify available options in any way. It just returns them as they are provided from options gatherer
 */
@Component(
{
    selector: 'no-options-handler',
    template: '',
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
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### public properties - implementation of OptionsHandler #########################

    /**
     * @inheritdoc
     */
    public readonly availableOptions: Signal<readonly SelectOption<TValue>[]|undefined|null>;

    /**
     * @inheritdoc
     */
    public readonly listOptions: Signal<readonly SelectOption<TValue>[]|undefined|null>;

    //######################### constructor #########################
    constructor()
    {
        this.availableOptions = computed(() => this.selectBus.selectOptions().optionsGatherer.availableOptions());
        this.listOptions = computed(() => this.availableOptions());
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
}
