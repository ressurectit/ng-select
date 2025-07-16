/**
 * Available plugin types
 */
export enum SelectPluginType
{
    /**
     * Plugin that handles interactions of plugins and select
     */
    Interactions = 'Interactions',

    /**
     * Plugin that handles keyboard input from user
     */
    KeyboardHandler = 'KeyboardHandler',

    /**
     * Plugin that is used for live search of options
     */
    LiveSearch = 'LiveSearch',

    /**
     * Plugin that is used for displaying normal state of selected value
     */
    NormalState = 'NormalState',

    /**
     * Plugin that is used for handling available options
     */
    OptionsHandler = 'OptionsHandler',

    /**
     * Plugin that handles displaying popup
     */
    Popup = 'Popup',

    /**
     * Plugin that handles positioning of popup
     */
    Positioner = 'Positioner',

    /**
     * Plugin that is used for displaying readonly state of selected value
     */
    ReadonlyState = 'ReadonlyState',

    /**
     * Plugin that is used for storing and handling value of select
     */
    ValueHandler = 'ValueHandler',
}
