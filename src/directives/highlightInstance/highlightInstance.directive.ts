import {computed, Directive, inject, OnDestroy, Signal} from '@angular/core';

import {Select} from '../../components';
import {SelectPluginType} from '../../misc/enums';

/**
 * Name of highlight registered in CSS highlights registry
 */
const HIGHLIGHT_NAME = 'search-query';

/**
 * Highlight shared by all instances, CSS highlights registry is global for whole document, so there can be only one highlight with name 'search-query'
 */
let sharedHighlight: Highlight|null = null;

/**
 * Number of active instances using shared highlight
 */
let sharedHighlightRefCount: number = 0;

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
     * Shared instance of highlight, null if CSS highlights are not supported
     */
    protected highlight: Highlight|null = null;

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
        if(!CSS.highlights)
        {
            return;
        }

        if(!sharedHighlight || !sharedHighlightRefCount)
        {
            sharedHighlight = new Highlight();
            CSS.highlights.set(HIGHLIGHT_NAME, sharedHighlight);
        }

        sharedHighlightRefCount++;
        this.highlight = sharedHighlight;
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        if(!CSS.highlights || !this.highlight)
        {
            return;
        }

        this.highlight = null;
        sharedHighlightRefCount--;

        if(sharedHighlightRefCount <= 0)
        {
            sharedHighlightRefCount = 0;
            sharedHighlight = null;
            CSS.highlights.delete(HIGHLIGHT_NAME);
        }
    }

    //######################### public methods #########################

    /**
     * Normalizes text for comparison, uses select's normalize function (same as used for filtering, default removes diacritics) and converts it to lower case
     * @param text - Text to be normalized
     */
    public normalizeText(text: string): string
    {
        const normalize = this.select.selectOptions?.normalize;

        return (normalize ? normalize(text) ?? '' : text).toLowerCase();
    }

    /**
     * Registers ranges for highlighting
     * @param ranges - Ranges to be registered for highlighting
     */
    public registerHighlightRanges(ranges: Range[]): void
    {
        if(!this.highlight)
        {
            return;
        }

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
        if(!this.highlight)
        {
            return;
        }

        for(const range of ranges)
        {
            this.highlight.delete(range);
        }
    }
}
