import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';

import {BasicKeyboardHandlerOptions, BasicKeyboardHandler} from './basicKeyboardHandler.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {KEYBOARD_HANDLER_OPTIONS} from '../types';
import {ɵNgSelectOption} from '../../../components/option';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';

/**
 * Default options for keyboard handler
 * @internal
 */
const defaultOptions: BasicKeyboardHandlerOptions =
{
};

/**
 * Component used for obtaining basic keyboard handler html element
 */
@Component(
{
    selector: "ng-basic-keyboard-handler",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicKeyboardHandlerComponent implements BasicKeyboardHandler, NgSelectPlugin<BasicKeyboardHandlerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicKeyboardHandlerOptions;

    /**
     * Popup that is displayed
     */
    protected _popup: Popup;

    //######################### protected properties #########################

    /**
     * Gets currently available options
     */
    protected get availableOptions(): ɵNgSelectOption[]
    {
        return this.pluginBus.selectOptions.optionsGatherer.availableOptions;
    }

    //######################### public properties - implementation of BasicKeyboardHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicKeyboardHandlerOptions
    {
        return this._options;
    }
    public set options(options: BasicKeyboardHandlerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                @Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: BasicKeyboardHandlerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this.pluginBus.selectElement)
        {
            this.pluginBus.selectElement.nativeElement.removeEventListener('keydown', this._handleKeyboard);
        }
    }

    //######################### public methods - implementation of BasicKeyboardHandler #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this.pluginBus.selectElement)
        {
            this.pluginBus.selectElement.nativeElement.addEventListener('keydown', this._handleKeyboard);
        }

        let popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._popup = null;
        }
        
        if(!this._popup)
        {
            this._popup = popup;
        }
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
    }

    //######################### protected methods #########################

    /**
     * Handles keyboard event
     * @param event - Keyboard event that occured
     */
    protected _handleKeyboard = (event: KeyboardEvent) =>
    {
        if(event.key == "ArrowDown" || event.key == "ArrowUp")
        {
            this.pluginBus.showHidePopup.emit(true);
            let activeOption = this.availableOptions.find(itm => itm.active);

            if(activeOption)
            {
                let index = this.availableOptions.indexOf(activeOption);
                activeOption.active = false;

                //move down cursor
                if(event.key == "ArrowDown")
                {
                    index += 1;
                }
                //move up cursor
                else
                {
                    index -= 1;
                }

                if(index < 0)
                {
                    index = this.availableOptions.length - 1;
                }

                index = index % this.availableOptions.length;

                this.availableOptions[index].active = true;
            }
            //none active before
            else if(this.availableOptions.length)
            {
                this.availableOptions[0].active = true;
            }

            this._popup.invalidateVisuals();
            event.preventDefault();
        }

        if(event.key == "Enter")
        {
            let activeOption = this.availableOptions.find(itm => itm.active);

            if(activeOption)
            {
                this.pluginBus.optionSelect.emit(activeOption);
            }

            event.preventDefault();
        }

        if(event.key == "Tab" || event.key == "Escape")
        {
            this.pluginBus.showHidePopup.emit(false);
        }
    }
}