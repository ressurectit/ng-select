import {Observable} from 'rxjs';

import {SelectEvent} from '../selectEvent/selectEvent.interface';

/**
 * Represents all events implemented by select bus
 */
export interface SelectEvents
{
    //######################### public properties - events #########################

    /**
     * Occurs when any part of select gains focus
     */
    readonly focus: Observable<SelectEvent>;

    /**
     * Occurs when there is click on select itself (anywhere in select)
     */
    readonly click: Observable<SelectEvent>;

    /**
     * Occurs when any part of select loses focus
     */
    readonly blur: Observable<SelectEvent>;
}
