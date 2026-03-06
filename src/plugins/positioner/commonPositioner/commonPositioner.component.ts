import {ChangeDetectionStrategy, Component, effect, ElementRef, Inject, inject, OnDestroy, Optional, Renderer2} from '@angular/core';
import {applyPositionResult, Position, POSITION, PositionPlacement} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {Subscription} from 'rxjs';

import {Positioner} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {POSITIONER_OPTIONS} from '../../../misc/tokens';

const defaultOptions: PositionOptions =
{
};

/**
 * Component used for positioning popup using `Position` from `@anglr/common` package
 */
@Component(
{
    selector: 'common-positioner',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonPositioner<TValue = unknown> implements Positioner<TValue, PositionOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of service used for positioning
     */
    protected positioner: Position<HTMLElement> = inject(POSITION) as Position<HTMLElement>;

    /**
     * Instance of angular renderer
     */
    protected renderer: Renderer2 = inject(Renderer2);

    /**
     * Instance of resize observer
     */
    protected selectWidthObserver: ResizeObserver;

    /**
     * Subscription for position change
     */
    protected positionChange: Subscription|undefined|null;

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: PositionOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus) as SelectBus<TValue>;

    //######################### constructor #########################
    constructor(@Inject(POSITIONER_OPTIONS) @Optional() options?: RecursivePartial<PositionOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as PositionOptions,
                                                 options);

        this.selectWidthObserver = new ResizeObserver(([firstChange]) => this.renderer.setStyle(this.selectPlugins.Popup.pluginElement.nativeElement, 'minWidth', `${firstChange.contentRect.width}px`));
        this.selectWidthObserver.observe(this.selectBus.selectElement().nativeElement);

        effect(() => this.renderer.setStyle(this.selectPlugins.Popup.pluginElement.nativeElement, 'position', 'absolute'));

        effect(() =>
        {
            this.positionChange?.unsubscribe();
            this.positionChange = new Subscription();

            this.positionChange.add(this.positioner
                .placeElement(this.selectPlugins.Popup.pluginElement.nativeElement, this.selectBus.selectElement().nativeElement, {autoUpdate: true, flip: true, placement: PositionPlacement.BottomStart})
                .subscribe(result => applyPositionResult(result)));
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.selectWidthObserver.disconnect();
        this.positionChange?.unsubscribe();
        this.positionChange = null;
    }
}
