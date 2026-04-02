import {ChangeDetectionStrategy, Component, effect, ElementRef, Inject, inject, OnDestroy, Optional, Renderer2} from '@angular/core';
import {BindThis, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {PopoverPositionerOptions, Positioner} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {POSITIONER_OPTIONS} from '../../../misc/tokens';

const defaultOptions: PopoverPositionerOptions =
{
    popoverAuto: false,
};

/**
 * Component used for positioning popup using native popover features of browser
 */
@Component(
{
    selector: 'popover-positioner',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPositioner<TValue = unknown> implements Positioner<TValue, PopoverPositionerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of angular renderer
     */
    protected renderer: Renderer2 = inject(Renderer2);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: PopoverPositionerOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### constructor #########################
    constructor(@Inject(POSITIONER_OPTIONS) @Optional() options?: RecursivePartial<PopoverPositionerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as PopoverPositionerOptions,
                                                 options);

        effect(() =>
        {
            const popupElement = this.selectPlugins.popup()?.pluginElement.nativeElement;

            popupElement?.removeEventListener('toggle', this.toggle);
            popupElement?.addEventListener('toggle', this.toggle);
            this.renderer.setProperty(popupElement, 'popover', this.options.popoverAuto ? 'auto' : 'manual');
            this.renderer.addClass(popupElement, 'popover-popup');
        });

        effect(() =>
        {
            const popupElement = this.selectPlugins.popup()?.pluginElement.nativeElement;
            const popupVisible = this.selectBus.popupVisible();

            if(popupVisible)
            {
                popupElement?.showPopover();
            }
            else
            {
                popupElement?.hidePopover();
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        const popupElement = this.selectPlugins.popup()?.pluginElement.nativeElement;

        popupElement?.removeEventListener('toggle', this.toggle);
    }

    //######################### protected methods #########################

    /**
     * Toggles the popover
     */
    @BindThis
    protected toggle(event: ToggleEvent): void
    {
        if(event.newState == 'closed')
        {
            this.selectBus.popupVisible.set(false);
        }
    }
}
