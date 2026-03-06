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
}
