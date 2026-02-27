import {Component, ElementRef} from '@angular/core';

import {KeyboardHandler} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';

/**
 *
 */
@Component(
{
    selector: 'simple-keyboard-handler',
    template: '',
})
export class SimpleKeyboardHandlerComponent implements KeyboardHandler
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
