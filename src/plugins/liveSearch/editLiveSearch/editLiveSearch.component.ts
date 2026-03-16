import {afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, signal, Signal} from '@angular/core';
import {debounce, disabled, form, FormField} from '@angular/forms/signals';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {LiveSearch, LiveSearchCssClasses, LiveSearchOptions, SelectPlugin} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {LIVE_SEARCH_OPTIONS} from '../../../misc/tokens';

const defaultOptions: LiveSearchOptions<LiveSearchCssClasses> =
{
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
        FormField,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLiveSearch<TValue = unknown> implements LiveSearch<TValue, LiveSearchOptions<LiveSearchCssClasses>>
{
    //######################### protected properties - template bindings #########################

    /**
     * Instance of form value
     */
    protected value = form(signal(''), path =>
    {
        debounce(path, 280);
        disabled(path, () => this.selectBus.selectOptions().readonly);
    });

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
        });
    }
}
