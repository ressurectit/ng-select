import {Directive, OnInit, Input} from '@angular/core';

import {SelectComponent} from '../../components';
import {LiveSearchOptions} from '../../plugins/liveSearch';

/**
 * Directive used for setting live search placeholder text
 */
@Directive(
{
    selector: 'ng-select[placeholder]',
})
export class SelectPlaceholderDirective implements OnInit
{
    //######################### public properties - inputs #########################

    /**
     * Placeholder text used for live search plugin
     */
    @Input()
    public placeholder: string;

    //######################### constructor #########################
    constructor(private _select: SelectComponent)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this._select.selectOptions =
        {
            plugins:
            {
                liveSearch:
                {
                    options: <LiveSearchOptions>
                    {
                        texts:
                        {
                            inputPlaceholder: this.placeholder
                        },
                    },
                },
            },
        };
    }
}
