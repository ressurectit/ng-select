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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoLiveSearch<TValue = unknown> implements LiveSearch<TValue, LiveSearchOptions>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: LiveSearchOptions = {cssClasses: {}};

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

    //######################### public properties - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public readonly search: Signal<string> = signal('');
}
