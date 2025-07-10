import {Observable} from 'rxjs';

import {SelectEvent} from '../selectEvent/selectEvent.interface';
import {SelectOption} from '../selectOption/selectOption.interface';

/**
 * Represents all events implemented by select bus
 */
export interface SelectBusEvents
{
    //######################### public properties - events #########################

    /**
     * Occurs when popup visibility should be toggled
     */
    readonly togglePopup: Observable<SelectEvent>;

    /**
     * Occurs when popup visibility should be changed
     */
    readonly showHidePopup: Observable<SelectEvent<boolean>>;

    /**
     * Occurs when option should be selected
     */
    readonly optionSelect: Observable<SelectEvent<SelectOption>>;

    /**
     * Occurs when option should be canceled
     */
    readonly optionCancel: Observable<SelectEvent<SelectOption>>;

    /**
     * Occurs when any part of select gains focus
     */
    readonly focus: Observable<SelectEvent>;

    /**
     * Occurs when live search should gain focus
     */
    readonly liveSearchFocus: Observable<SelectEvent>;

    /**
     * Occurs when there is need for updating displayed value
     */
    readonly updateDisplayedValue: Observable<SelectEvent>;
}
