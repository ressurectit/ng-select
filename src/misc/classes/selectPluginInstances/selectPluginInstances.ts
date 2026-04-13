import {signal, WritableSignal} from '@angular/core';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, SelectPlugin, ValueHandler} from '../../../interfaces';
import {SelectPluginType} from '../../enums';

/**
 * Implementation of GridPluginInstances
 */
export class SelectPluginInstances<TValue = unknown, TPublicValue = TValue> implements Record<SelectPluginType, SelectPlugin<unknown, TValue, TPublicValue>>
{
    //######################### public properties #########################

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public interactions: WritableSignal<Interactions<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public keyboardHandler: WritableSignal<KeyboardHandler<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for live search of options
     */
    public liveSearch: WritableSignal<LiveSearch<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public normalState: WritableSignal<NormalState<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for handling available options
     */
    public optionsHandler: WritableSignal<OptionsHandler<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles displaying popup
     */
    public popup: WritableSignal<Popup<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles positioning of popup
     */
    public positioner: WritableSignal<Positioner<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public readonlyState: WritableSignal<ReadonlyState<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public valueHandler: WritableSignal<ValueHandler<TValue, TPublicValue>|undefined|null> = signal(null);

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public get Interactions(): Interactions<TValue, TPublicValue>
    {
        const interactions = this.interactions();

        if(!interactions)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Interactions');
        }

        return interactions;
    }
    public set Interactions(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.interactions.set(value as Interactions<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public get KeyboardHandler(): KeyboardHandler<TValue, TPublicValue>
    {
        const keyboardHandler = this.keyboardHandler();

        if(!keyboardHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of KeyboardHandler');
        }

        return keyboardHandler;
    }
    public set KeyboardHandler(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.keyboardHandler.set(value as KeyboardHandler<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that is used for live search of options
     */
    public get LiveSearch(): LiveSearch<TValue, TPublicValue>
    {
        const liveSearch = this.liveSearch();

        if(!liveSearch)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of LiveSearch');
        }

        return liveSearch;
    }
    public set LiveSearch(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.liveSearch.set(value as LiveSearch<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public get NormalState(): NormalState<TValue, TPublicValue>
    {
        const normalState = this.normalState();

        if(!normalState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of NormalState');
        }

        return normalState;
    }
    public set NormalState(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.normalState.set(value as NormalState<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that is used for handling available options
     */
    public get OptionsHandler(): OptionsHandler<TValue, TPublicValue>
    {
        const optionsHandler = this.optionsHandler();

        if(!optionsHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of OptionsHandler');
        }

        return optionsHandler;
    }
    public set OptionsHandler(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.optionsHandler.set(value as OptionsHandler<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that handles displaying popup
     */
    public get Popup(): Popup<TValue, TPublicValue>
    {
        const popup = this.popup();

        if(!popup)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Popup');
        }

        return popup;
    }
    public set Popup(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.popup.set(value as Popup<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that handles positioning of popup
     */
    public get Positioner(): Positioner<TValue, TPublicValue>
    {
        const positioner = this.positioner();

        if(!positioner)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Positioner');
        }

        return positioner;
    }
    public set Positioner(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.positioner.set(value as Positioner<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public get ReadonlyState(): ReadonlyState<TValue, TPublicValue>
    {
        const readonlyState = this.readonlyState();

        if(!readonlyState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ReadonlyState');
        }

        return readonlyState;
    }
    public set ReadonlyState(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.readonlyState.set(value as ReadonlyState<TValue, TPublicValue>);
    }

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public get ValueHandler(): ValueHandler<TValue, TPublicValue>
    {
        const valueHandler = this.valueHandler();

        if(!valueHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ValueHandler');
        }

        return valueHandler;
    }
    public set ValueHandler(value: SelectPlugin<unknown, TValue, TPublicValue>)
    {
        this.valueHandler.set(value as ValueHandler<TValue, TPublicValue>);
    }
}
