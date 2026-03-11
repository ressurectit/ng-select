import {OptionGetterFunc} from '../../../misc/types';
import {ValueHandlerOptions} from './valueHandler.interface';

/**
 * Options for dynamic value handler plugin
 */
export interface DynamicValueHandlerOptions<TValue = unknown> extends ValueHandlerOptions
{
    //######################### properties #########################

    /**
     * Function for obtaining option for provided value
     */
    optionGetter: OptionGetterFunc<TValue>;
}
