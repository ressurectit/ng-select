import {Injectable, ElementRef, signal, WritableSignal, Signal} from '@angular/core';
import {Subject} from 'rxjs';

import {SelectEvents, SelectBusOptions, SelectEvent, SelectOption} from '../../../interfaces';

/**
 * Class represents centralized bus for internal communication
 */
@Injectable()
export class SelectBus<TValue = unknown> implements SelectEvents
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
     */
    public selectElement: WritableSignal<ElementRef<HTMLElement>|undefined|null> = signal(null);

    /**
     * Currently selected options of Select
     */
    public selectedOptions: WritableSignal<SelectOption<TValue>|SelectOption<TValue>[]|undefined|null> = signal(null);

    //######################### public properties - events #########################

    /**
     * @inheritdoc
     */
    public readonly togglePopup: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly showHidePopup: Subject<SelectEvent<boolean>> = new Subject<SelectEvent<boolean>>();

    /**
     * @inheritdoc
     */
    public readonly optionSelect: Subject<SelectEvent<SelectOption>> = new Subject<SelectEvent<SelectOption>>();

    /**
     * @inheritdoc
     */
    public readonly optionCancel: Subject<SelectEvent<SelectOption>> = new Subject<SelectEvent<SelectOption>>();

    /**
     * @inheritdoc
     */
    public readonly focus: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly liveSearchFocus: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly updateDisplayedValue: Subject<SelectEvent> = new Subject<SelectEvent>();

    /**
     * @inheritdoc
     */
    public readonly click: Subject<SelectEvent> = new Subject<SelectEvent>();
}
