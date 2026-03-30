import {afterRenderEffect, ChangeDetectionStrategy, Component, computed, DOCUMENT, effect, ElementRef, Inject, inject, OnDestroy, Optional, signal, Signal, viewChild, WritableSignal} from '@angular/core';
import {LocalizePipe, LOGGER, Logger, TooltipDirective} from '@anglr/common';
import {isDescendant, isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {LiveSearch, EditLiveSearchCssClasses, LiveSearchOptions, SelectPlugin} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {LIVE_SEARCH_OPTIONS} from '../../../misc/tokens';
import {DisplayValue, HasValue} from '../../../pipes';

const defaultOptions: LiveSearchOptions<EditLiveSearchCssClasses> =
{
    searchDebounceTimeout: 280,
    cssClasses:
    {
        componentElement: 'live-search-component',
        searchElement: 'live-search-input',
        multiple: 'select-flex-1',
        single: 'absolute-input',
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
        HasValue,
        DisplayValue,
        LocalizePipe,
        TooltipDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLiveSearch<TValue = unknown> implements LiveSearch<TValue, LiveSearchOptions<EditLiveSearchCssClasses>>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Indication whether input search value is empty
     */
    protected emptyInputSignal: WritableSignal<boolean> = signal(true);

    /**
     * Timeout used for debouncing search input
     */
    protected timeout: number|undefined|null;

    /**
     * Instance of logger for logging purposes
     */
    protected logger: Logger = inject(LOGGER);

    /**
     * Value of search input holding value that was set by user
     */
    protected valueOutput: WritableSignal<string> = signal('');

    /**
     * Reference to document object for DOM operations
     */
    protected document: Document = inject(DOCUMENT);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: LiveSearchOptions<EditLiveSearchCssClasses>;

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

    //######################### protected properties - children #########################

    /**
     * HTML input element used for search input
     */
    protected htmlInput: Signal<ElementRef<HTMLInputElement>> = viewChild.required('htmlInput');

    //######################### protected properties - template bindings #########################

    /**
     * Css classes applied to search input element
     */
    protected cssClasses: Signal<string[]>;

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
    constructor(@Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: RecursivePartial<LiveSearchOptions<EditLiveSearchCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as LiveSearchOptions<EditLiveSearchCssClasses>,
                                                 options);

        this.search = computed(() => this.valueOutput());

        const ref = afterRenderEffect(() =>
        {
            if(this.pluginElement.nativeElement.parentElement?.nodeName == 'NG-SELECT')
            {
                this.logger.verbose('Select: Live Search: removing plugin from DOM');
                this.pluginElement.nativeElement.remove();
            }

            ref.destroy();
        });

        effect(() =>
        {
            this.selectBus.selectedOptions();
            this.logger.verbose('Select: Live Search: selected value changed, resetting search input');

            this.clearSearchInput();
        });

        effect(() =>
        {
            //prevents clearing when changing tab or window
            if(!this.selectBus.hasFocusComputed() && (!this.document.activeElement || !isDescendant(this.selectBus.selectElement().nativeElement, this.document.activeElement as HTMLElement)))
            {
                this.logger.verbose('Select: Live Search: select lost focus, resetting search input');
                this.clearSearchInput();
            }
        });

        this.cssClasses = computed(() => [this.options.cssClasses.searchElement,
                                          ...(this.selectBus.selectOptions().multiple ? [...this.options.cssClasses.multiple.split(' ')] : [...this.options.cssClasses.single.split(' ')])]);
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
        this.selectBus.internalsFocus.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles blur event
     */
    protected blur(): void
    {
        this.selectBus.internalsBlur.next(
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

        this.emptyInputSignal.set((event.target as HTMLInputElement).value.length == 0);

        this.timeout = setTimeout(() =>
        {
            this.logger.verbose('Select: Live Search: emitting search value {{value}}', {value: (event.target as HTMLInputElement).value});
            this.valueOutput.set((event.target as HTMLInputElement).value);
        }, this.options.searchDebounceTimeout) as unknown as number;
    }

    //######################### protected methods #########################

    /**
     * Clears search input value and sets empty input signal to true
     */
    protected clearSearchInput(): void
    {
        this.htmlInput().nativeElement.value = '';
        this.emptyInputSignal.set(true);
        this.valueOutput.set('');
    }
}
