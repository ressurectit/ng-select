import {ChangeDetectionStrategy, Component, ElementRef, inject, Signal, signal} from '@angular/core';

import {LiveSearch, LiveSearchOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';

/**
 * Component used for no live search
 */
@Component(
{
    selector: 'no-live-search',
    template: '',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoLiveSearch<TValue = unknown, TPublicValue = TValue> implements LiveSearch<TValue, TPublicValue, LiveSearchOptions>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: LiveSearchOptions = {cssClasses: {componentElement: 'live-search-component'}, searchDebounceTimeout: 0};

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

    //######################### public properties - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public readonly search: Signal<string> = signal('');

    /**
     * @inheritdoc
     */
    public readonly emptyInput: Signal<boolean> = signal(true);

    //######################### public methods - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
    }
}
