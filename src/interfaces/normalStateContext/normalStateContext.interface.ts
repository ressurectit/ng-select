import {NormalState} from '../plugins';

/**
 * Context for template that is used within normal state plugin for rendering content
 */
export interface NormalStateContext<TValue = unknown>
{
    /**
     * Instance of plugin itself
     */
    $implicit: NormalState<TValue>;
}
