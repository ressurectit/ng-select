import {afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, signal, Signal, WritableSignal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {LocalizePipe} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {LiveSearch, LiveSearchCssClasses, FilterLiveSearchOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {LIVE_SEARCH_OPTIONS} from '../../../misc/tokens';

const defaultOptions: FilterLiveSearchOptions<LiveSearchCssClasses> =
{
    searchDebounceTimeout: 280,
    texts:
    {
        searchPlaceholder: 'filter options',
    },
    cssClasses:
    {
        componentElement: 'live-search-component',
    },
};

/**
 * Live search component used for filtering listed options
 */
@Component(
{
    selector: 'filter-live-search',
    templateUrl: 'filterLiveSearch.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    imports:
    [
        FormField,
        LocalizePipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterLiveSearch<TValue = unknown, TPublicValue = TValue> implements LiveSearch<TValue, TPublicValue, FilterLiveSearchOptions<LiveSearchCssClasses>>
{
    //######################### protected fields #########################

    /**
     * Indication whether input search value is empty
     */
    protected emptyInputSignal: WritableSignal<boolean> = signal(true);

    //######################### protected properties - template bindings #########################

    /**
     * Instance of form value
     */
    protected value;

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: FilterLiveSearchOptions<LiveSearchCssClasses>;

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
    public readonly search: Signal<string>;

    /**
     * @inheritdoc
     */
    public get emptyInput(): Signal<boolean>
    {
        return this.emptyInputSignal.asReadonly();
    }

    //######################### constructor #########################
    constructor(@Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: RecursivePartial<FilterLiveSearchOptions<LiveSearchCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as FilterLiveSearchOptions<LiveSearchCssClasses>,
                                                 options);

        this.value = form(signal(''), path => debounce(path, this.options.searchDebounceTimeout));

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

    //######################### public methods - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
    }

    //######################### protected methods - template bindings #########################

    /**
     * Handles input event on search input
     * @param event - Event that occured
     */
    protected input(event: Event): void
    {
        this.emptyInputSignal.set((event.target as HTMLInputElement).value.length == 0);
    }
}
