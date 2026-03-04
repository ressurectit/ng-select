import {Observable} from 'rxjs';

import {SelectEvent} from '../selectEvent/selectEvent.interface';
import {SelectOptionState} from '../selectOptionState/selectOptionState.interface';
import {KeyboardAction} from '../keyboardAction/keyboardAction.interface';

/**
 * Represents all events implemented by select bus
 */
export interface SelectEvents<TValue = unknown, TAction extends string = string>
{
    //######################### public properties - events #########################

    /**
     * Occurs when option in popup was clicked
     */
    readonly optionClick: Observable<SelectEvent<SelectOptionState<TValue>>>;

    /**
     * Occurs when any part of select gains focus
     */
    readonly focus: Observable<SelectEvent>;

    /**
     * Occurs when there is click on select itself (normal state)
     */
    readonly click: Observable<SelectEvent>;

    /**
     * Occurs when certain keys on keyboard are pressed
     */
    readonly keyboardAction: Observable<SelectEvent<KeyboardAction<TAction>>>;
}
