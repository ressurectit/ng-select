import {Component, ElementRef} from '@angular/core';

import {Popup} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'simple-popup',
    template: '',
})
export class SimplePopupComponent implements Popup
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
