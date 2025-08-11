import {Component, ElementRef} from '@angular/core';

import {OptionsHandler} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'no-options-handler',
    template: '',
})
export class NoOptionsHandlerComponent implements OptionsHandler
{
    /**
     * @inheritdoc
     */
    public options: unknown;

    //######################### constructor #########################
    constructor(public pluginElement: ElementRef<HTMLElement>,
                public selectPlugins: SelectPluginInstances,
                public pluginBus: SelectBus<unknown>,)
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

    /**
     * @inheritdoc
     */
    public invalidateVisuals(): void
    {
    }
}
