import {computed, Directive, inject, OnDestroy, Signal} from '@angular/core';

import {Select} from '../../components';
import {SelectPluginType} from '../../misc/enums';

/**
 * Directive that manages highlighting for popup
 */
@Directive(
{
    selector: '[highlightInstance]',
})
export class HighlightInstance<TValue = unknown, TPublicValue = TValue> implements OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of select component
     */
    protected select: Select<TValue, TPublicValue> = inject(Select);

    /**
     * Shared instance of highlight
     */
    protected highlight: Highlight = new Highlight();

    //######################### public properties #########################

    /**
     * Signal that represents current search query
     */
    public searchQuery: Signal<string> = computed(() =>
    {
        if(!this.select.initialized())
        {
            return '';
        }

        const liveSearch = this.select.getPlugin(SelectPluginType.LiveSearch);

        return liveSearch.search();
    });

    /**
     * Indication whether highlighting is enabled or not
     */
    public enabled: Signal<boolean> = computed(() =>
    {
        if(!CSS.highlights ||!this.select.initialized())
        {
            return false;
        }

        const popup = this.select.getPlugin(SelectPluginType.Popup);

        return popup.options.searchHighlighting;
    });

    //######################### constructor #########################
    constructor()
    {
        CSS.highlights.set('search-query', this.highlight);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        CSS.highlights.delete('search-query');
    }

    //######################### public methods #########################

    /**
     * Registers ranges for highlighting
     * @param ranges - Ranges to be registered for highlighting
     */
    public registerHighlightRanges(ranges: Range[]): void
    {
        for(const range of ranges)
        {
            this.highlight.add(range);
        }
    }

    /**
     * Unregisters ranges from highlighting
     * @param ranges - Ranges to be unregistered from highlighting
     */
    public unregisterHighlightRanges(ranges: Range[]): void
    {
        for(const range of ranges)
        {
            this.highlight.delete(range);
        }
    }
}
