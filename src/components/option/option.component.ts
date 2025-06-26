import {Component, ChangeDetectionStrategy, WritableSignal, signal, InputSignal, input, Signal} from '@angular/core';

import {ɵSelectOption, SelectOptionGroup} from '../../interfaces';

/**
 * Component used for options in select component
 */
@Component(
{
    selector: 'ng-option',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<TValue = unknown> implements ɵSelectOption<TValue>
{
    //######################### public properties - implementation of ɵSelectOption #########################

    /**
     * @inheritdoc
     */
    public active: WritableSignal<boolean> = signal(false);

    /**
     * @inheritdoc
     */
    public selected: WritableSignal<boolean> = signal(false);

    //######################### public properties - implementation of SelectOption #########################

    /**
     * @inheritdoc
     */
    public value: InputSignal<TValue|undefined|null> = input();

    /**
     * @inheritdoc
     */
    public text: InputSignal<string> = input('');

    /**
     * @inheritdoc
     */
    public group: Signal<SelectOptionGroup|undefined|null> = signal(null);
}
