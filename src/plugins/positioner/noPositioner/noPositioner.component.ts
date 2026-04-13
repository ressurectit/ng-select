import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';

import {Positioner} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';

/**
 * Component that does no positioning
 */
@Component(
{
    selector: 'no-positioner',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoPositioner<TValue = unknown, TPublicValue = TValue> implements Positioner<TValue, TPublicValue, PositionOptions>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: PositionOptions = {};

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue, TPublicValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue, TPublicValue> = inject(SelectBus);
}
