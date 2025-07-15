import {SelectOption} from '../selectOption/selectOption.interface';

/**
 * Context for template that is used within popup plugin for rendering option
 */
export interface PopupContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: SelectOption;

    // /**
    //  * Instance of plugin itself
    //  */
    // popup: Popup;
}
