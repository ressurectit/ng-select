import {Injectable, EventEmitter, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';

import {SelectBusEvents, SelectEvent, SelectOption} from '../../../interfaces';

/**
 * Class represents centralized bus for internal communication
 */
@Injectable()
export class PluginBus<TValue = unknown> implements SelectBusEvents
{
    //######################### public properties #########################

    /**
     * Options passed to select
     */
    public selectOptions: PluginBusOptions<TValue>|undefined|null;

    /**
     * HTML element that represents select itself
     */
    public selectElement: ElementRef<HTMLElement>|undefined|null;

    //######################### public properties - events #########################

    /**
     * Occurs when popup visibility should be toggled
     */
    public readonly togglePopup: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * Occurs when popup visibility should be changed
     */
    public readonly showHidePopup: Subject<SelectEvent<boolean>> = new EventEmitter<SelectEvent<boolean>>();

    /**
     * Occurs when option should be selected
     */
    public readonly optionSelect: Subject<SelectEvent<SelectOption>> = new EventEmitter<SelectEvent<SelectOption>>();

    /**
     * Occurs when option should be canceled
     */
    public readonly optionCancel: Subject<SelectEvent<SelectOption>> = new EventEmitter<SelectEvent<SelectOption>>();

    /**
     * Occurs when any part of select gains focus
     */
    public readonly focus: Subject<SelectEvent> = new EventEmitter<SelectEvent>();

    /**
     * Occurs when live search should gain focus
     */
    public readonly liveSearchFocus: Subject<SelectEvent> = new EventEmitter<SelectEvent>();

    /**
     * Occurs when there is need for updating displayed value
     */
    public readonly updateDisplayedValue: Subject<SelectEvent> = new EventEmitter<SelectEvent>();
}
