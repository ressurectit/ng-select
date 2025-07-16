import {SelectPlugin} from '../../../interfaces';
import {SelectPluginType} from '../../enums';

/**
 * Implementation of GridPluginInstances
 */
export class SelectPluginInstances implements Record<SelectPluginType, SelectPlugin>
{
    //######################### public properties - implementation of SelectPluginInstances #########################

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public interactions?: Interactions;

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public keyboardHandler?: KeyboardHandler;

    /**
     * Instance of plugin that is used for live search of options
     */
    public liveSearch?: LiveSearch;

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public normalState?: NormalState;

    /**
     * Instance of plugin that is used for handling available options
     */
    public optionsHandler?: OptionsHandler;

    /**
     * Instance of plugin that handles displaying popup
     */
    public popup?: Popup;

    /**
     * Instance of plugin that handles positioning of popup
     */
    public positioner?: Positioner;

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public readonlyState?: ReadonlyState;

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public valueHandler?: ValueHandler;

    /**
     * Instance of plugin that handles interactions of plugins and select
     */
    public get Interactions(): Interactions
    {
        if(!this.interactions)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Interactions');
        }

        return this.interactions;
    }
    public set Interactions(value: Interactions)
    {
        this.interactions = value;
    }

    /**
     * Instance of plugin that handles keyboard input from user
     */
    public get KeyboardHandler(): KeyboardHandler
    {
        if(!this.keyboardHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of KeyboardHandler');
        }

        return this.keyboardHandler;
    }
    public set KeyboardHandler(value: KeyboardHandler)
    {
        this.keyboardHandler = value;
    }

    /**
     * Instance of plugin that is used for live search of options
     */
    public get LiveSearch(): LiveSearch
    {
        if(!this.liveSearch)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of LiveSearch');
        }

        return this.liveSearch;
    }
    public set LiveSearch(value: LiveSearch)
    {
        this.liveSearch = value;
    }

    /**
     * Instance of plugin that is used for displaying normal state of selected value
     */
    public get NormalState(): NormalState
    {
        if(!this.normalState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of NormalState');
        }

        return this.normalState;
    }
    public set NormalState(value: NormalState)
    {
        this.normalState = value;
    }

    /**
     * Instance of plugin that is used for handling available options
     */
    public get OptionsHandler(): OptionsHandler
    {
        if(!this.optionsHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of OptionsHandler');
        }

        return this.optionsHandler;
    }
    public set OptionsHandler(value: OptionsHandler)
    {
        this.optionsHandler = value;
    }

    /**
     * Instance of plugin that handles displaying popup
     */
    public get Popup(): Popup
    {
        if(!this.popups)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Popup');
        }

        return this.popup;
    }
    public set Popup(value: Popup)
    {
        this.popup = value;
    }

    /**
     * Instance of plugin that handles positioning of popup
     */
    public get Positioner(): Positioner
    {
        if(!this.positioner)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of Positioner');
        }

        return this.positioner;
    }
    public set Positioner(value: Positioner)
    {
        this.positioner = value;
    }

    /**
     * Instance of plugin that is used for displaying readonly state of selected value
     */
    public get ReadonlyState(): ReadonlyState
    {
        if(!this.readonlyState)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ReadonlyState');
        }

        return this.readonlyState;
    }
    public set ReadonlyState(value: ReadonlyState)
    {
        this.readonlyState = value;
    }

    /**
     * Instance of plugin that is used for storing and handling value of select
     */
    public get ValueHandler(): ValueHandler
    {
        if(!this.valueHandler)
        {
            throw new Error('SelectPluginInstances: missing plugin instance of ValueHandler');
        }

        return this.valueHandler;
    }
    public set ValueHandler(value: ValueHandler)
    {
        this.valueHandler = value;
    }
}
