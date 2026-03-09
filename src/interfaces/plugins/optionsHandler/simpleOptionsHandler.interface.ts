import {OptionsHandlerOptions} from './optionsHandler.interface';

/**
 * Options for simple options handler plugin
 */
export interface SimpleOptionsHandlerOptions extends OptionsHandlerOptions
{
    //######################### properties #########################

    /**
     * Indication whether display selected option in list of available options
     */
    listSelected: boolean;
}
