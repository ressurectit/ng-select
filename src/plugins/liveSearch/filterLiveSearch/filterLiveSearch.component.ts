import {Component, ElementRef} from '@angular/core';

import {LiveSearch} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'filter-live-search',
    template: '',
})
export class FilterLiveSearchComponent implements LiveSearch
{
    /**
     * @inheritdoc
     */
    public options: unknown;

    //######################### constructor #########################
    constructor(public pluginElement: ElementRef<HTMLElement>,
                public selectPlugins: SelectPluginInstances,
                public selectBus: SelectBus<unknown>,)
    {

    }

    //######################### public methods - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    public initialize(): void
    {
    }

    /**
     * @inheritdoc
     */
    public initOptions(): void
    {
    }
}
