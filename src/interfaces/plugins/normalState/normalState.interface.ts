import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {VisualPluginOptions} from '../../visualPluginOptions/visualPluginOptions.interface';

/**
 * Texts that are used within normal state plugin
 */
export interface NormalStateTexts
{
    //######################### properties #########################

    /**
     * Title for cancel button
     */
    cancelTitle: string;
}

/**
 * CSS classes for normal state plugin
 */
export interface NormalStateCssClasses
{
}

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses extends NormalStateCssClasses = NormalStateCssClasses> extends VisualPluginOptions<TCssClasses>
{
    //######################### properties #########################

    /**
     * Indication whether allow cancel value
     */
    cancelValue: boolean;

    /**
     * Texts used within normal state plugin
     */
    texts: NormalStateTexts;
}

/**
 * Normal state plugin interface
 */
export interface NormalState<TValue = unknown, TOptions extends NormalStateOptions = NormalStateOptions> extends SelectPlugin<TOptions, TValue>
{
    //######################### methods #########################

    /**
     * Sets focus on plugin element
     */
    focus(): void;
}
