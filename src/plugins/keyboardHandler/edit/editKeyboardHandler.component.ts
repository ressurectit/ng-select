import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common/extend';

import {EditKeyboardHandlerOptions, EditKeyboardHandler} from './editKeyboardHandler.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {KEYBOARD_HANDLER_OPTIONS} from '../types';
import {ɵNgSelectOption} from '../../../components/option';
import {Popup} from '../../popup';
import {POPUP} from '../../popup/types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {ValueHandler} from '../../valueHandler';
import {VALUE_HANDLER} from '../../valueHandler/types';
import {LiveSearch} from '../../liveSearch';
import {LIVE_SEARCH} from '../../liveSearch/types';

/**
 * Default options for keyboard handler
 * @internal
 */
const defaultOptions: EditKeyboardHandlerOptions =
{
};

/**
 * Component used for obtaining edit keyboard handler html element
 */
@Component(
{
    selector: 'ng-edit-keyboard-handler',
    template: '',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditKeyboardHandlerComponent implements EditKeyboardHandler, NgSelectPlugin<EditKeyboardHandlerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: EditKeyboardHandlerOptions;

    /**
     * Popup that is displayed
     */
    protected _popup: Popup;

    /**
     * Value handler used for hanling current value
     */
    protected _valueHandler: ValueHandler;

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    //######################### protected properties #########################

    /**
     * Gets currently available options
     */
    protected get availableOptions(): ɵNgSelectOption[]
    {
        return this.pluginBus.selectOptions.optionsGatherer.availableOptions;
    }

    //######################### public properties - implementation of EditKeyboardHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): EditKeyboardHandlerOptions
    {
        return this._options;
    }
    public set options(options: EditKeyboardHandlerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                @Optional() public pluginBus: PluginBus,
                public pluginElement: ElementRef,
                @Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: EditKeyboardHandlerOptions)
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

    //######################### public methods - implementation of EditKeyboardHandler #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this.pluginBus.selectElement)
        {
            this.pluginBus.selectElement.nativeElement.addEventListener('keydown', this._handleKeyboard);
        }

        const popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;
        }

        const valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;
        }

        const liveSearch = this.ngSelectPlugins[LIVE_SEARCH] as LiveSearch;

        if(this._liveSearch && this._liveSearch != liveSearch)
        {
            this._liveSearch = null;
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;
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
        if(event.key == 'ArrowDown' || event.key == 'ArrowUp')
        {
            this.pluginBus.showHidePopup.emit(true);
            const activeOption = this.availableOptions.find(itm => itm.active);

            //update active option
            if(activeOption)
            {
                let index = this.availableOptions.indexOf(activeOption);
                activeOption.active = false;

                //move down cursor
                if(event.key == 'ArrowDown')
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

                //first if oveflow
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

        //prevent enter if popup is opened and select option
        if(event.key == 'Enter' && this._popup.popupElement)
        {
            const activeOption = this.availableOptions.find(itm => itm.active);

            if(activeOption)
            {
                this.pluginBus.optionSelect.emit(activeOption);
            }
            //add non existing
            else if(this.pluginBus.selectOptions.useNonExistingAsValue)
            {
                this.pluginBus.optionSelect.emit(
                <ɵNgSelectOption>
                {
                    text: this._liveSearch.searchValue,
                    value: this._liveSearch.searchValue,
                    selected: true
                });
            }

            event.preventDefault();
        }

        //select if active if popup is opened
        if(event.key == 'Tab' && this._popup.popupElement)
        {
            const active = this.availableOptions.find(itm => itm.active);

            if(active)
            {
                this.pluginBus.optionSelect.emit(active);
            }
            //add non existing
            else if(this.pluginBus.selectOptions.useNonExistingAsValue)
            {
                this.pluginBus.optionSelect.emit(
                <ɵNgSelectOption>
                {
                    text: this._liveSearch.searchValue,
                    value: this._liveSearch.searchValue,
                    selected: true
                });
            }

            this.pluginBus.showHidePopup.emit(false);
            this.pluginBus.updateDisplayedValue.emit();
        }

        //cancel event if multi and empty
        if(event.key == 'Backspace' && this.pluginBus.selectOptions.multiple && !this._liveSearch.searchValue)
        {
            const options = this._valueHandler.selectedOptions;

            if(options && Array.isArray(options) && options.length)
            {
                this.pluginBus.optionCancel.emit(options[options.length - 1]);
            }
        }

        //close on esc
        if(event.key == 'Escape')
        {
            this.pluginBus.showHidePopup.emit(false);
        }
    };
}
