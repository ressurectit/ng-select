import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, OnDestroy, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend, isDescendant} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {EditPopupOptions, EditPopup} from './editPopup.interface';
import {NgSelectPluginGeneric, OptionsGatherer, TemplateGatherer} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {POPUP_OPTIONS} from '../types';
import {ɵNgSelectOption, NgSelectOption} from '../../../components/option';
import {NormalState} from '../../normalState';
import {NORMAL_STATE} from '../../normalState/types';
import {KeyboardHandler} from '../../keyboardHandler';
import {KEYBOARD_HANDLER} from '../../keyboardHandler/types';
import {ValueHandler} from '../../valueHandler';
import {VALUE_HANDLER} from '../../valueHandler/types';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: EditPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering edit popup with options
 */
@Component(
{
    selector: "div.ng-select-edit-popup",
    templateUrl: 'editPopup.component.html',
    styleUrls: ['editPopup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPopupComponent implements EditPopup, NgSelectPluginGeneric<EditPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: EditPopupOptions;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<any>;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Subscription for click event on normal state
     */
    protected _clickSubscription: Subscription;

    /**
     * Subscription for popup visibility request from keyboard handler
     */
    protected _khPopupVisibilityRequestSubscription: Subscription;

    /**
     * Subscription for popup visibility request from value handler
     */
    protected _vhPopupVisibilityRequestSubscription: Subscription;

    /**
     * Normal state that is displayed
     */
    protected _normalState: NormalState;

    /**
     * Keyboard handler that is used
     */
    protected _keyboardHandler: KeyboardHandler;

    /**
     * Value handler that is used
     */
    protected _valueHandler: ValueHandler<any>;

    /**
     * Indication whether is popup visible
     */
    protected _popupVisible: boolean = false;

    //######################### public properties - implementation of EditPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): EditPopupOptions
    {
        return this._options;
    }
    public set options(options: EditPopupOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    public optionClick: EventEmitter<NgSelectOption<any>> = new EventEmitter<NgSelectOption<any>>();

    /**
     * Occurs when visibility of popup has changed
     */
    public visibilityChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Html element that represents popup itself
     */
    public get popupElement(): HTMLElement
    {
        let ref = this.popupElementChildren.first;

        if(!ref)
        {
            return null;
        }

        return ref.nativeElement;
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption<any>[];

    //######################### public properties - children #########################

    /**
     * Watch for visibility of popup div element
     * @internal
     */
    @ViewChildren('popupDiv')
    public popupElementChildren: QueryList<ElementRef<HTMLElement>>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: EditPopupOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this.popupElementChildren.changes.subscribe(() =>
        {
            if(!!this.popupElementChildren.first == this._popupVisible)
            {
                return;
            }

            //handle click outside
            if(this.popupElementChildren.first)
            {
                this._document.addEventListener('mouseup', this._handleClickOutside);
            }
            //unregister handle click outside
            else
            {
                this._document.removeEventListener('mouseup', this._handleClickOutside);
            }

            this._popupVisible = !!this.popupElementChildren.first;
            this.visibilityChange.emit()
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }

        if(this._clickSubscription)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;
        }

        if(this._khPopupVisibilityRequestSubscription)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;
        }

        if(this._vhPopupVisibilityRequestSubscription)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;
        }

        this._document.removeEventListener('mouseup', this._handleClickOutside);
    }

    //######################### public methods - implementation of EditPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() => this.loadOptions());
        }

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(this._normalState && this._normalState != normalState)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;

            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;

            this._clickSubscription = this._normalState.click.subscribe(() => this.togglePopup());
        }

        let keyboardHandler = this.ngSelectPlugins[KEYBOARD_HANDLER] as KeyboardHandler;

        if(this._keyboardHandler && this._keyboardHandler != keyboardHandler)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;

            this._keyboardHandler = null;
        }

        if(!this._keyboardHandler)
        {
            this._keyboardHandler = keyboardHandler;

            this._khPopupVisibilityRequestSubscription = this._keyboardHandler.popupVisibilityRequest.subscribe(this._handleVisibilityChange);
        }

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler<any>;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;

            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;

            this._vhPopupVisibilityRequestSubscription = this._valueHandler.popupVisibilityRequest.subscribe(this._handleVisibilityChange);
        }

        this.loadOptions();
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### protected methods #########################

    /**
     * Loads options
     */
    protected loadOptions()
    {
        this.selectOptions = this._optionsGatherer.availableOptions;
        this._changeDetector.detectChanges();
    }

    /**
     * Toggles popup visibility
     */
    protected togglePopup()
    {
        this.options.visible = !this.options.visible;
        this._changeDetector.detectChanges();
    }

    /**
     * Handles click outside of select element
     * @param event Mouse event object
     */
    protected _handleClickOutside = (event: MouseEvent) =>
    {
        if(this.selectElement != event.target &&
           !isDescendant(this.selectElement, event.target as HTMLElement) &&
           this.pluginElement.nativeElement != event.target &&
           !isDescendant(this.pluginElement.nativeElement, event.target as HTMLElement))
        {
            this.togglePopup();
        }
    }

    /**
     * Handles visibility change
     */
    protected _handleVisibilityChange = (visible: boolean) =>
    {
        if(this.options.visible != visible)
        {
            this.options.visible = visible;
            this._changeDetector.detectChanges();
        }
    };
}