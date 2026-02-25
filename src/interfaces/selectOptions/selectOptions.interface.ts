import {SelectBusOptions} from '../selectBusOptions/selectBusOptions.interface';
import {SelectCssClasses} from '../selectCssClasses/selectCssClasses.interface';
import {SelectPluginTypes} from '../selectPluginTypes/selectPluginTypes.interface';

/**
 * Describes select options used for Select
 */
export interface SelectOptions<TValue = unknown, TCssClasses = SelectCssClasses> extends SelectBusOptions<TValue>
{
    /**
     * Css classes applied to select component
     */
    cssClasses: TCssClasses;

    /**
     * Object defining overrides for default plugins, default plugins can be also specified using DI
     */
    plugins: SelectPluginTypes;

    /**
     * Indication whether is 'Popup' plugin displayd inside of Select (false) or directly in Body (true)
     */
    absolute: boolean;

    /**
     * String that defines element in which should be absolute popup rendered, if not specified, body is used, used only if absolute is set to true, otherwise it has no effect
     *
     * Allows also css classes to be specified (div.body-box)
     */
    containerElement: string|undefined|null;
}
