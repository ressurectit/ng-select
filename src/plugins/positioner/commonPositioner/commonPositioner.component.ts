import {ChangeDetectionStrategy, Component, effect, ElementRef, Inject, inject, OnDestroy, Optional, Renderer2} from '@angular/core';
import {applyPositionResult, Position, POSITION, PositionPlacement} from '@anglr/common';
import {isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {Subscription} from 'rxjs';

import {Positioner, CommonPositionerOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {POSITIONER_OPTIONS} from '../../../misc/tokens';

const defaultOptions: CommonPositionerOptions =
{
    zIndex: 0,
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
export class CommonPositioner<TValue = unknown, TPublicValue = TValue> implements Positioner<TValue, TPublicValue, CommonPositionerOptions>, OnDestroy
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
    public options: CommonPositionerOptions;

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

    //######################### constructor #########################
    constructor(@Inject(POSITIONER_OPTIONS) @Optional() options?: RecursivePartial<CommonPositionerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as CommonPositionerOptions,
                                                 options);

        this.selectWidthObserver = new ResizeObserver(([firstChange]) => this.renderer.setStyle(this.selectPlugins.Popup.pluginElement.nativeElement, 'minWidth', `${firstChange.contentRect.width}px`));
        this.selectWidthObserver.observe(this.selectBus.selectElement().nativeElement);

        effect(() => this.renderer.setStyle(this.selectPlugins.Popup.pluginElement.nativeElement, 'position', 'absolute'));
        effect(() => isPresent(this.options.zIndex) ? this.renderer.setStyle(this.selectPlugins.Popup.pluginElement.nativeElement, 'z-index', this.options.zIndex) : false);

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
