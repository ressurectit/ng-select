import {SelectPlugin} from '../../selectPlugin/selectPlugin.interface';
import {VisualPluginOptions} from '../../visualPluginOptions/visualPluginOptions.interface';

/**
 * Texts that are used within NormalState
 */
export interface NormalStateTexts
{
    /**
     * Displayed when there is no value selected, represents empty value, used if value is null or empty array
     */
    nothingSelected?: string;
}

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses = unknown, TValue = unknown> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Texts that are used within any NormalState
     */
    texts?: NormalStateTexts;

    /**
     * Function used for transformation of option into display text
     */
    optionDisplayText?: DisplayTextFunc<TValue>;
}

/**
 * Normal state plugin interface
 */
export interface NormalState extends SelectPlugin
{
}
