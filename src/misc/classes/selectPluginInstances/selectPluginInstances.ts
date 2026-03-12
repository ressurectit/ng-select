import {signal, WritableSignal} from '@angular/core';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, SelectPlugin, ValueHandler} from '../../../interfaces';
import {SelectPluginType} from '../../enums';

/**
 * Implementation of GridPluginInstances
 */
export class SelectPluginInstances<TValue = unknown> implements Record<SelectPluginType, SelectPlugin<unknown, TValue>>
{
    //######################### public properties #########################

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public interactions: WritableSignal<Interactions<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public keyboardHandler: WritableSignal<KeyboardHandler<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for live search of options
     */
    public liveSearch: WritableSignal<LiveSearch<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public normalState: WritableSignal<NormalState<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for handling available options
     */
    public optionsHandler: WritableSignal<OptionsHandler<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles displaying popup
     */
    public popup: WritableSignal<Popup<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles positioning of popup
     */
    public positioner: WritableSignal<Positioner<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public readonlyState: WritableSignal<ReadonlyState<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public valueHandler: WritableSignal<ValueHandler<TValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public get Interactions(): Interactions<TValue>
    {
        const interactions = this.interactions();

        if(!interactions)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Interactions');
        }

        return interactions;
    }
    public set Interactions(value: SelectPlugin<unknown, TValue>)
    {
        this.interactions.set(value as Interactions<TValue>);
    }

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public get KeyboardHandler(): KeyboardHandler<TValue>
    {
        const keyboardHandler = this.keyboardHandler();

        if(!keyboardHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of KeyboardHandler');
        }

        return keyboardHandler;
    }
    public set KeyboardHandler(value: SelectPlugin<unknown, TValue>)
    {
        this.keyboardHandler.set(value as KeyboardHandler<TValue>);
    }

    /**
     * Instance of plugin that is used for live search of options
     */
    public get LiveSearch(): LiveSearch<TValue>
    {
        const liveSearch = this.liveSearch();

        if(!liveSearch)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of LiveSearch');
        }

        return liveSearch;
    }
    public set LiveSearch(value: SelectPlugin<unknown, TValue>)
    {
        this.liveSearch.set(value as LiveSearch<TValue>);
    }

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public get NormalState(): NormalState<TValue>
    {
        const normalState = this.normalState();

        if(!normalState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of NormalState');
        }

        return normalState;
    }
    public set NormalState(value: SelectPlugin<unknown, TValue>)
    {
        this.normalState.set(value as NormalState<TValue>);
    }

    /**
     * Instance of plugin that is used for handling available options
     */
    public get OptionsHandler(): OptionsHandler<TValue>
    {
        const optionsHandler = this.optionsHandler();

        if(!optionsHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of OptionsHandler');
        }

        return optionsHandler;
    }
    public set OptionsHandler(value: SelectPlugin<unknown, TValue>)
    {
        this.optionsHandler.set(value as OptionsHandler<TValue>);
    }

    /**
     * Instance of plugin that handles displaying popup
     */
    public get Popup(): Popup<TValue>
    {
        const popup = this.popup();

        if(!popup)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Popup');
        }

        return popup;
    }
    public set Popup(value: SelectPlugin<unknown, TValue>)
    {
        this.popup.set(value as Popup<TValue>);
    }

    /**
     * Instance of plugin that handles positioning of popup
     */
    public get Positioner(): Positioner<TValue>
    {
        const positioner = this.positioner();

        if(!positioner)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Positioner');
        }

        return positioner;
    }
    public set Positioner(value: SelectPlugin<unknown, TValue>)
    {
        this.positioner.set(value as Positioner<TValue>);
    }

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public get ReadonlyState(): ReadonlyState<TValue>
    {
        const readonlyState = this.readonlyState();

        if(!readonlyState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ReadonlyState');
        }

        return readonlyState;
    }
    public set ReadonlyState(value: SelectPlugin<unknown, TValue>)
    {
        this.readonlyState.set(value as ReadonlyState<TValue>);
    }

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public get ValueHandler(): ValueHandler<TValue>
    {
        const valueHandler = this.valueHandler();

        if(!valueHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ValueHandler');
        }

        return valueHandler;
    }
    public set ValueHandler(value: SelectPlugin<unknown, TValue>)
    {
        this.valueHandler.set(value as ValueHandler<TValue>);
    }
}
