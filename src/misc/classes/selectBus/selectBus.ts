import {Injectable, ElementRef, signal, WritableSignal, Signal} from '@angular/core';
import {Subject} from 'rxjs';

import {SelectEvents, SelectBusOptions, SelectEvent, SelectOptionState, KeyboardAction} from '../../../interfaces';

/**
 * Class represents centralized bus for internal communication
 */
@Injectable()
export class SelectBus<TValue = unknown, TAction = string> implements SelectEvents<TValue, TAction>
{
    //######################### public properties #########################

    /**
     * Options passed to select
     *
     * Initialized in constructor of select
     */
    public selectOptions!: Signal<SelectBusOptions<TValue>>;

    /**
     * HTML element that represents select itself
     *
     * Initialized in constructor of select
     */
    public selectElement!: Signal<ElementRef<HTMLElement>>;

    /**
     * Currently selected options of Select
     */
    public selectedOptions: WritableSignal<SelectOptionState<TValue>|SelectOptionState<TValue>[]|undefined|null> = signal(null);

    //######################### public properties - events #########################

    /**
     * @inheritdoc
     */
    public readonly optionClick: Subject<SelectEvent<SelectOptionState<TValue>>> = new Subject<SelectEvent<SelectOptionState<TValue>>>();

    /**
     * @inheritdoc
     */
    public readonly focus: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly click: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly keyboardAction: Subject<SelectEvent<KeyboardAction<TAction>>> = new Subject<SelectEvent<KeyboardAction<TAction>>>();

    //######################### public properties - state #########################

    /**
     * Indicates whether is popup visible or not
     */
    public readonly popupVisible: WritableSignal<boolean> = signal(false);
}
