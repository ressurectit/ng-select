/**
 * Context for template that is used within popup plugin for rendering option
 */
export interface PopupContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: NgSelectOption;

    /**
     * Instance of plugin itself
     */
    popup: Popup;
}
