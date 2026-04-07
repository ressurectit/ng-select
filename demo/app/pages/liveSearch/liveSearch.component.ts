import {Component, ChangeDetectionStrategy, signal} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {Select, Option, SelectFormControl, SelectOptions, FilterLiveSearch} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

/**
 * Component used for displaying live search select demo
 */
@Component(
{
    selector: 'live-search-view',
    templateUrl: 'liveSearch.component.html',
    imports:
    [
        Select,
        Option,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@WithScrollableCssClass()
export default class LiveSearchComponent
{
    //######################### protected properties - template bindings #########################

    /**
     * Form value
     */
    protected value = form(signal<string|null>(null));

    /**
     * Options for select
     */
    protected options: RecursivePartial<SelectOptions<string>> =
    {
        plugins:
        {
            liveSearch:
            {
                type: FilterLiveSearch,
            },
            popup:
            {
                options:
                {
                    liveSearchEnabled: true,
                },
            },
        },
    };
}
