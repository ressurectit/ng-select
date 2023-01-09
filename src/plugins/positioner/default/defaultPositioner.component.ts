import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy, PLATFORM_ID, EventEmitter} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {applyPositionResult, Position, POSITION, PositionOffset, PositionPlacement} from '@anglr/common';
import {extend, NoopAction} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DefaultPositionerOptions, DefaultPositioner} from './defaultPositioner.interface';
import {NgSelectPlugin, OptionsGatherer} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {POSITIONER_OPTIONS} from '../types';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';

/**
 * Default options for positioner
 */
const defaultOptions: DefaultPositionerOptions =
{
    positionOptions:
    {
        offset: PositionOffset.None,
        placement: PositionPlacement.BottomStart,
    }
};

/**
 * Component used for positioning popup element, handles resize, scroll and collision using `Position`
 */
@Component(
{
    selector: 'ng-default-positioner',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultPositionerComponent implements DefaultPositioner, NgSelectPlugin<DefaultPositionerOptions>, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected optionsGatherer: OptionsGatherer;

    /**
     * Occurs when flip occured during positining of popup
     */
    protected ɵflip: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Options for NgSelect plugin
     */
    protected ɵoptions: DefaultPositionerOptions;

    /**
     * Subscription for visibility change of popup
     */
    protected visibilitySubscription: Subscription|undefined|null;

    /**
     * Subscription for positioning event that occured
     */
    protected positioningSubscription: Subscription|undefined|null;

    /**
     * Function used for disposing of positining watch
     */
    protected positioningDispose: NoopAction;

    /**
     * Popup that is displayed
     */
    protected popup: Popup;

    /**
     * Html element of popup plugin
     */
    protected popupElement: HTMLElement;

    /**
     * Indication whether is code running in browser
     */
    protected isBrowser: boolean = isPlatformBrowser(this.platformId);

    //######################### public properties - implementation of DefaultPositioner #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): DefaultPositionerOptions
    {
        return this.ɵoptions;
    }
    public set options(options: DefaultPositionerOptions)
    {
        this.ɵoptions = extend(true, this.ɵoptions, options);
    }

    /**
     * @inheritdoc
     */
    public get flip(): EventEmitter<void>
    {
        return this.ɵflip;
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                @Inject(POSITION) protected position: Position,
                @Inject(POSITIONER_OPTIONS) @Optional() options?: DefaultPositionerOptions,
                @Inject(PLATFORM_ID) protected platformId?: Object,)
    {
        this.ɵoptions = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this.visibilitySubscription?.unsubscribe();
        this.visibilitySubscription = null;

        this.positioningDispose?.();

        this.positioningSubscription?.unsubscribe();
        this.positioningSubscription = null;
    }

    //######################### public methods - implementation of DefaultPositioner #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        const popup: Popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this.popup && this.popup != popup)
        {
            this.visibilitySubscription?.unsubscribe();
            this.visibilitySubscription = null;

            this.popup = null;
        }

        if(!this.popup)
        {
            this.popup = popup;

            this.visibilitySubscription = this.popup.visibilityChange.subscribe(() => this.initPosition());
        }

        this.initPosition();
    }

    /**
     * @inheritdoc
     */
    public initOptions()
    {
    }

    /**
     * @inheritdoc
     */
    public invalidateVisuals(): void
    {
    }

    //######################### protected methods #########################

    /**
     * Initialize positioning of popup
     */
    protected initPosition()
    {
        this.popupElement = this.popup.popupElement;

        if(this.isBrowser)
        {
            //register events and handle position of opened popup
            if(this.popupElement)
            {
                this.positioningSubscription?.unsubscribe();
                this.positioningDispose?.();
                
                this.positioningSubscription = null;
                this.positioningDispose = null;

                this.positioningSubscription = this.position.placeElement(this.popupElement,
                                                                          this.pluginBus.selectElement.nativeElement,
                                                                          {
                                                                              autoUpdate: true,
                                                                              flip: true,
                                                                              ...this.options.positionOptions
                                                                          },)
                    .subscribe(result =>
                    {
                        applyPositionResult(result);
                        this.positioningDispose = result.dispose;

                        if(result.flip)
                        {
                            this.flip.emit();
                        }
                    });
            }
            //unregister events
            else
            {
                this.positioningSubscription?.unsubscribe();
                this.positioningDispose?.();

                this.positioningSubscription = null;
                this.positioningDispose = null;
            }
        }
    }
}