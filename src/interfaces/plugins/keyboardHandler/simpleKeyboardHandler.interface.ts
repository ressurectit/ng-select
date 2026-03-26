import {KeyboardHandlerOptions} from './keyboardHandler.interface';

/**
 * Options for simple keyboard handler plugin
 */
export interface SimpleKeyboardHandlerOptions extends KeyboardHandlerOptions
{
    //######################### properties #########################

    /**
     * Debounce timeout for selecting first option when typing
     */
    selectFirstDebounceTimeout: number;

    /**
     * Indication whether is alphanumeric search enabled, meaning that when user types alphanumeric keys (outside of live search), select will try to find option starting with searched text and select it
     */
    alphanumericSearch: boolean;

    /**
     * Indication whether live search events should be processed
     */
    liveSearchEvents: boolean;
}
