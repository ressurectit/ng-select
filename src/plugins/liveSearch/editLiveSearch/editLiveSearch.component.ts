import {afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, OnDestroy, Optional, signal, Signal, WritableSignal} from '@angular/core';
import {LocalizePipe, TooltipDirective} from '@anglr/common';
import {isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {LiveSearch, LiveSearchCssClasses, LiveSearchOptions, SelectOptionState, SelectPlugin} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {LIVE_SEARCH_OPTIONS} from '../../../misc/tokens';
import {DisplayValue} from '../../../pipes';

const defaultOptions: LiveSearchOptions<LiveSearchCssClasses> =
{
    searchDebounceTimeout: 280,
    cssClasses:
    {
        componentElement: 'live-search-component',
    },
};

/**
 * Live search component used for in edit Select.
 */
@Component(
{
    selector: 'edit-live-search',
    templateUrl: 'editLiveSearch.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    imports:
    [
        DisplayValue,
        LocalizePipe,
        TooltipDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLiveSearch<TValue = unknown> implements LiveSearch<TValue, LiveSearchOptions<LiveSearchCssClasses>>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Timeout used for debouncing search input
     */
    protected timeout: number|undefined|null;

    //######################### protected properties - template bindings #########################

    /**
     * Value of search input
     */
    protected value: Signal<SelectOptionState<TValue>|SelectOptionState<TValue>[]|null|undefined>;

    /**
     * Value of search input holding value that was set by user
     */
    protected valueOutput: WritableSignal<string> = signal('');

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: LiveSearchOptions<LiveSearchCssClasses>;

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

        this.search = computed(() => this.valueOutput());

        const ref = afterRenderEffect(() =>
        {
            if(this.pluginElement.nativeElement.parentElement?.nodeName == 'NG-SELECT')
            {
                this.pluginElement.nativeElement.remove();
            }

            ref.destroy();
        });

        this.value = computed(() =>
        {
            const options = this.selectBus.selectOptions();
            const selected = this.selectBus.selectedOptions();

            if(options.multiple)
            {
                return null;
            }
            else
            {
                if(options.templateGatherer.normalStateTemplate())
                {
                    return null;
                }
                else
                {
                    if(isPresent(selected) && !Array.isArray(selected))
                    {
                        return selected;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        if(isPresent(this.timeout))
        {
            clearTimeout(this.timeout);
        }
    }

    //######################### protected methods - template bindings #########################

    /**
     * Handles click event
     */
    protected click(): void
    {
        if(this.selectBus.popupVisible())
        {
            return;
        }

        this.selectBus.click.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles focus event
     */
    protected focus(): void
    {
        this.selectBus.focus.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles input event on search input
     * @param event - Event that occured
     */
    protected input(event: Event): void
    {
        this.selectBus.showPopup.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });

        if(isPresent(this.timeout))
        {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() =>
        {
            this.valueOutput.set((event.target as HTMLInputElement).value);
        }, this.options.searchDebounceTimeout) as unknown as number;
    }
}
