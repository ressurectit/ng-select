/**
 * Describes select options used for Select
 */
export interface SelectOptions<TValue = unknown> extends PluginBusOptions<TValue>
{
    /**
     * Indication whether Select should be initialized automaticaly during 'NgOnInit' phase
     */
    autoInitialize?: boolean;

    /**
     * Css classes applied to ng select component
     */
    cssClasses?: unknown;

    /**
     * Object defining overrides for default plugins, default plugins can be also specified using DI
     */
    plugins?: SelectPluginTypes;

    /**
     * Indication whether is 'Popup' plugin displayd inside of Select (false) or directly in Body (true)
     */
    absolute?: boolean;

    /**
     * String that defines element in which should be absolute popup rendered, if not specified, body is used, used only if absolute is set to true, otherwise it has no effect
     *
     * Allows also css classes to be specified (div.body-box)
     */
    containerElement?: string;

    /**
     * Indication whether force value check on initialization of select, this allows to change value of form control to value of ValueHandler
     */
    forceValueCheckOnInit?: boolean;
}
