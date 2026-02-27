import {Component, ElementRef} from '@angular/core';

import {Interactions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'no-interactions',
    template: '',
})
export class NoInteractionsComponent implements Interactions
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
