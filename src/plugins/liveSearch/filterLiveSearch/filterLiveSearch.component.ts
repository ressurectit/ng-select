import {afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, signal, Signal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {LiveSearch, LiveSearchCssClasses, LiveSearchOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {LIVE_SEARCH_OPTIONS} from '../../../misc/tokens';

const defaultOptions: LiveSearchOptions<LiveSearchCssClasses> =
{
    cssClasses:
    {
    },
};

/**
 * Live search component used for filtering listed options
 */
@Component(
{
    selector: 'filter-live-search',
    templateUrl: 'filterLiveSearch.component.html',
    imports:
    [
        FormField,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterLiveSearch<TValue = unknown> implements LiveSearch<TValue, LiveSearchOptions<LiveSearchCssClasses>>
{
    //######################### protected properties - template bindings #########################

    /**
     * Instance of form value
     */
    protected value = form(signal(''), path => debounce(path, 280));

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: LiveSearchOptions<LiveSearchCssClasses>;

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
    public readonly search: Signal<string>;

    //######################### constructor #########################
    constructor(@Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: RecursivePartial<LiveSearchOptions<LiveSearchCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as LiveSearchOptions<LiveSearchCssClasses>,
                                                 options);

        this.search = computed(() =>
        {
            return this.value().value();
        });

        const ref = afterRenderEffect(() =>
        {
            if(this.pluginElement.nativeElement.parentElement?.nodeName == 'NG-SELECT')
            {
                this.pluginElement.nativeElement.remove();
            }

            ref.destroy();
        });
    }
}
