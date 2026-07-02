import {afterRenderEffect, Directive, effect, ElementRef, inject, OnDestroy, signal, WritableSignal} from '@angular/core';

import {HighlightSearch} from '../highlightSearch/highlightSearch.directive';

/**
 * Directive that marks element that contains text that should be highlighted
 */
@Directive(
{
    selector: '[highlightText]',
})
export class HighlightText implements OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of element that will have highlighted text
     */
    protected element: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * Instance of HighlightSearch directive that is used to highlight text in the element
     */
    protected highlightSearch: HighlightSearch|undefined|null = inject(HighlightSearch, {optional: true});

    /**
     * Array of registered text nodes that are currently active on this element
     */
    protected textNodes: WritableSignal<Node[]> = signal([]);

    //######################### constructor #########################
    constructor()
    {
        if(!this.highlightSearch)
        {
            throw new Error('HighlightText: HighlightSearch directive is not found on parent elements. Use HighlightText within OptionTemplate directive.');
        }

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

                this.textNodes.set(nodes);
            },
        });

        effect(() =>
        {
            const nodes = this.textNodes();

            if(!nodes.length)
            {
                return;
            }

            this.highlightSearch?.addNodes(nodes);
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.highlightSearch?.removeNodes(this.textNodes());
    }
}
