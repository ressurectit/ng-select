import {afterRenderEffect, Directive, effect, ElementRef, inject, Injector, OnDestroy, signal, untracked, WritableSignal} from '@angular/core';

import {HighlightInstance} from '../highlightInstance/highlightInstance.directive';

/**
 * Direcitve that handles highlighting of search text, attached directly to option where highlighting should occur.
 */
@Directive(
{
    selector: '[highlightSearch]',
    exportAs: 'highlightSearch',
})
export class HighlightSearch implements OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of highlight instance
     */
    protected highlightInstance: HighlightInstance = inject(HighlightInstance);

    /**
     * Instance of element reference
     */
    protected element: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * All nodes that are children of this element and can be highlighted
     */
    protected nodes: WritableSignal<Node[]> = signal([]);

    /**
     * Array of registered text nodes that are currently active on this element
     */
    protected textNodes: WritableSignal<Node[]> = signal([]);

    /**
     * Array of highlighted ranges that are currently active on this element
     */
    protected ranges: WritableSignal<Range[]> = signal([]);

    //######################### public properties #########################

    /**
     * Instance of injector used for obtaining dependencies in templates
     */
    public injector: Injector = inject(Injector);

    //######################### constructor #########################
    constructor()
    {
        afterRenderEffect(
        {
            read: () =>
            {
                const nodes: Node[] = [];

                for(let x = 0; x < this.element.nativeElement.childNodes.length; x++)
                {
                    const node = this.element.nativeElement.childNodes.item(x);

                    if(node && node.nodeType === Node.TEXT_NODE)
                    {
                        nodes.push(node);
                    }
                }

                this.nodes.set(nodes);
            },
        });

        effect(() =>
        {
            const nodes = this.textNodes().length ? this.textNodes() : this.nodes();

            if(!this.highlightInstance.enabled() || !nodes.length)
            {
                return;
            }

            const searchQuery = this.highlightInstance.searchQuery();

            if(!searchQuery)
            {
                this.highlightInstance.unregisterHighlightRanges(untracked(() => this.ranges()));
                this.ranges.set([]);

                return;
            }

            this.highlightInstance.unregisterHighlightRanges(untracked(() => this.ranges()));

            this.ranges.set(nodes.flatMap(node =>
            {
                const ranges: Range[] = [];
                let text = node.textContent ?? '';
                let index: number;
                let length: number = 0;

                while((index = text.indexOf(searchQuery)) > -1)
                {
                    const range = new Range();

                    range.setStart(node, index + length);
                    range.setEnd(node, index + length + searchQuery.length);
                    ranges.push(range);

                    text = text.slice(index + searchQuery.length);
                    length += index + searchQuery.length;
                }

                return ranges;
            }));

            this.highlightInstance.registerHighlightRanges(untracked(() => this.ranges()));
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.highlightInstance.unregisterHighlightRanges(untracked(() => this.ranges()));
        this.ranges.set([]);
    }

    //######################### public methods #########################

    /**
     * Adds nodes to the list of text nodes that are currently active on this element
     * @param nodes - Nodes to be added
     */
    public addNodes(nodes: Node[]): void
    {
        this.textNodes.set([...untracked(() => this.textNodes()), ...nodes]);
    }

    /**
     * Removes nodes from the list of text nodes that are currently active on this element
     * @param nodes - Nodes to be removed
     */
    public removeNodes(nodes: Node[]): void
    {
        this.textNodes.set(untracked(() => this.textNodes()).filter(node => !nodes.includes(node)));
    }
}
