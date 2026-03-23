import {Injectable, ElementRef, signal, WritableSignal, Signal, computed} from '@angular/core';
import {Subject} from 'rxjs';

import {SelectEvents, SelectBusOptions, SelectEvent, SelectOptionState, KeyboardAction} from '../../../interfaces';

/**
 * Class represents centralized bus for internal communication
 */
@Injectable()
export class SelectBus<TValue = unknown, TAction = string> implements SelectEvents
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
    public readonly selectedOptions: WritableSignal<SelectOptionState<TValue>|SelectOptionState<TValue>[]|undefined|null> = signal(null);

    /**
     * Indicates whether is popup visible or not
     */
    public readonly popupVisible: WritableSignal<boolean> = signal(false);

    /**
     * Occurs when option is being to be activated
     */
    public readonly optionActivate: Subject<SelectEvent<SelectOptionState<TValue>>> = new Subject<SelectEvent<SelectOptionState<TValue>>>();

    /**
     * Occurs when certain keys on keyboard are pressed
     */
    public readonly keyboardAction: Subject<SelectEvent<KeyboardAction<TAction>>> = new Subject<SelectEvent<KeyboardAction<TAction>>>();

    /**
     * Occurs when popup should be shown
     */
    public readonly showPopup: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * Occurs when popup should be hidden
     */
    public readonly hidePopup: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * Occurs when option needs to be marked as active (hovered or keyboard focused)
     */
    public readonly markOption: Subject<SelectEvent<SelectOptionState<TValue>>> = new Subject<SelectEvent<SelectOptionState<TValue>>>();

    /**
     * Indication whether Select has focus
     */
    public readonly hasFocus: WritableSignal<boolean> = signal(false);

    /**
     * Computed indication whether Select has focus
     */
    public readonly hasFocusComputed: Signal<boolean> = computed(() => this.hasFocus());

    /**
     * Occurs when select internals receives focus
     */
    public readonly internalsFocus: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * Occurs when select internals loses focus
     */
    public readonly internalsBlur: Subject<SelectEvent> = new Subject<SelectEvent>();

    //######################### public properties - events #########################

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
    public readonly blur: Subject<SelectEvent> = new Subject<SelectEvent>();
}
