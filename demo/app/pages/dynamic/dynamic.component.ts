import {Component, ChangeDetectionStrategy, signal, effect, Signal, viewChild} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {form, FormField} from '@angular/forms/signals';
import {WithScrollableCssClass} from '@anglr/common';
import {CodeOptionsGatherer, FilterLiveSearch, Select, SelectFormControl, SelectOption, SelectOptions, SelectPluginType} from '@anglr/select';
import {RecursivePartial} from '@jscrpt/common';

import {DataService} from '../../services/data';

/**
 * Component used for displaying dynamic select demo
 */
@Component(
{
    selector: 'dynamic-view',
    templateUrl: 'dynamic.component.html',
    imports:
    [
        Select,
        JsonPipe,
        FormField,
        SelectFormControl,
    ],
    providers:
    [
        DataService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@WithScrollableCssClass()
export default class DynamicComponent
{
    //######################### protected fields #########################

    /**
     * Options gatherer used for obtaining options from code
     */
    protected optionsGatherer: CodeOptionsGatherer<string> = new CodeOptionsGatherer();

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
        optionsGatherer: this.optionsGatherer,
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

    //######################### protected properties - children #########################

    /**
     * Child that represents select component
     */
    protected select: Signal<Select<string>> = viewChild.required(Select);

    //######################### constructor #########################
    constructor(dataSvc: DataService,)
    {
        let lastQuery: string = '';

        effect(async () =>
        {
            const select = this.select();

            if(!select.initialized())
            {
                return;
            }

            const query = select.getPlugin(SelectPluginType.LiveSearch).search();
            lastQuery = query;

            if(!query)
            {
                this.optionsGatherer.setAvailableOptions([]);

                return;
            }

            const result = await dataSvc.getData(query);

            if(lastQuery !== query)
            {
                return;
            }

            this.optionsGatherer.setAvailableOptions(result.map(itm =>
            {
                return <SelectOption<string>>{
                    text: signal(itm.popis ?? ''),
                    value: signal(itm.kod ?? ''),
                    group: signal(null),
                };
            }));
        });
    }
}
