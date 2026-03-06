import {Component, ElementRef} from '@angular/core';

import {LiveSearch} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'no-live-search',
    template: '',
})
export class NoLiveSearchComponent implements LiveSearch
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
}
