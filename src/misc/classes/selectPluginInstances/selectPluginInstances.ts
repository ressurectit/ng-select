import {signal, WritableSignal} from '@angular/core';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, SelectPlugin, ValueHandler} from '../../../interfaces';
import {SelectPluginType} from '../../enums';

/**
 * Implementation of GridPluginInstances
 */
export class SelectPluginInstances implements Record<SelectPluginType, SelectPlugin>
{
    //######################### public properties #########################

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public interactions: WritableSignal<Interactions|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public keyboardHandler: WritableSignal<KeyboardHandler|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for live search of options
     */
    public liveSearch: WritableSignal<LiveSearch|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public normalState: WritableSignal<NormalState|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for handling available options
     */
    public optionsHandler: WritableSignal<OptionsHandler|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles displaying popup
     */
    public popup: WritableSignal<Popup|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles positioning of popup
     */
    public positioner: WritableSignal<Positioner|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public readonlyState: WritableSignal<ReadonlyState|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public valueHandler: WritableSignal<ValueHandler|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public get Interactions(): Interactions
    {
        const interactions = this.interactions();

        if(!interactions)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Interactions');
        }

        return interactions;
    }
    public set Interactions(value: Interactions)
    {
        this.interactions.set(value);
    }

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public get KeyboardHandler(): KeyboardHandler
    {
        const keyboardHandler = this.keyboardHandler();

        if(!keyboardHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of KeyboardHandler');
        }

        return keyboardHandler;
    }
    public set KeyboardHandler(value: KeyboardHandler)
    {
        this.keyboardHandler.set(value);
    }

    /**
     * Instance of plugin that is used for live search of options
     */
    public get LiveSearch(): LiveSearch
    {
        const liveSearch = this.liveSearch();

        if(!liveSearch)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of LiveSearch');
        }

        return liveSearch;
    }
    public set LiveSearch(value: LiveSearch)
    {
        this.liveSearch.set(value);
    }

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public get NormalState(): NormalState
    {
        const normalState = this.normalState();

        if(!normalState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of NormalState');
        }

        return normalState;
    }
    public set NormalState(value: NormalState)
    {
        this.normalState.set(value);
    }

    /**
     * Instance of plugin that is used for handling available options
     */
    public get OptionsHandler(): OptionsHandler
    {
        const optionsHandler = this.optionsHandler();

        if(!optionsHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of OptionsHandler');
        }

        return optionsHandler;
    }
    public set OptionsHandler(value: OptionsHandler)
    {
        this.optionsHandler.set(value);
    }

    /**
     * Instance of plugin that handles displaying popup
     */
    public get Popup(): Popup
    {
        const popup = this.popup();

        if(!popup)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Popup');
        }

        return popup;
    }
    public set Popup(value: Popup)
    {
        this.popup.set(value);
    }

    /**
     * Instance of plugin that handles positioning of popup
     */
    public get Positioner(): Positioner
    {
        const positioner = this.positioner();

        if(!positioner)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Positioner');
        }

        return positioner;
    }
    public set Positioner(value: Positioner)
    {
        this.positioner.set(value);
    }

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public get ReadonlyState(): ReadonlyState
    {
        const readonlyState = this.readonlyState();

        if(!readonlyState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ReadonlyState');
        }

        return readonlyState;
    }
    public set ReadonlyState(value: ReadonlyState)
    {
        this.readonlyState.set(value);
    }

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public get ValueHandler(): ValueHandler
    {
        const valueHandler = this.valueHandler();

        if(!valueHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ValueHandler');
        }

        return valueHandler;
    }
    public set ValueHandler(value: ValueHandler)
    {
        this.valueHandler.set(value);
    }
}
