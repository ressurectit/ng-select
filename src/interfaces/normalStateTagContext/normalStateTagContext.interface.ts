import {NormalState} from '../plugins';
import {SelectOptionState} from '../selectOptionState/selectOptionState.interface';

/**
 * Context for template that is used within normal state plugin for rendering tag
 */
export interface NormalStateTagContext<TValue = unknown>
{
    /**
     * Instance of rendered option
     */
    $implicit: SelectOptionState<TValue>;

    /**
     * Instance of plugin itself
     */
    normalState: NormalState<TValue>;
}
