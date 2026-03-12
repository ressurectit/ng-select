import {OptionsHandlerOptions} from './optionsHandler.interface';

/**
 * Options for simple options handler plugin
 */
export interface SimpleOptionsHandlerOptions<TValue = unknown> extends OptionsHandlerOptions<TValue>
{
    //######################### properties #########################

    /**
     * Indication whether display selected option in list of available options
     */
    listSelected: boolean;
}
