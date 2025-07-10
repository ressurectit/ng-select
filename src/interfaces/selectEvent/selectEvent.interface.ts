import {Select} from '../select/select.interface';
import {SelectPlugin} from '../selectPlugin/selectPlugin.interface';

/**
 * Event that is used for 'void' events, storing information about source of event and source element
 */
export interface SelectEvent<TData = void>
{
    /**
     * Html element that caused the event
     */
    sourceElement: HTMLElement;

    /**
     * Instance of select or select plugin that caused event
     */
    source: Select|SelectPlugin;

    /**
     * Data passed with event that occured
     */
    data?: TData;
}
