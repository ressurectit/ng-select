import {Popup} from '../plugins';
import {SelectOptionState} from '../selectOptionState/selectOptionState.interface';

/**
 * Context for template that is used within popup plugin for rendering option
 */
export interface PopupContext<TValue = unknown>
{
    /**
     * Instance of plugin itself
     */
    $implicit: SelectOptionState<TValue>;

    /**
     * Instance of plugin itself
     */
    popup: Popup<TValue>;
}
