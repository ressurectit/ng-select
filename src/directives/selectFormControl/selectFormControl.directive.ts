import {Directive, input, InputSignal, model, ModelSignal} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

/**
 * Form value control for Select
 */
@Directive(
{
    selector: 'ng-select[formField]',
})
export class SelectFormControl<TValue = unknown> implements FormValueControl<TValue|TValue[]|undefined|null>
{
    //######################### public properties - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public value: ModelSignal<TValue|TValue[]|null|undefined> = model<TValue|TValue[]|null|undefined>(undefined);

    /**
     * @inheritdoc
     */
    public checked: undefined;

    /**
     * @inheritdoc
     */
    public disabled: InputSignal<boolean> = input(false);

    /**
     * @inheritdoc
     */
    public readonly: InputSignal<boolean> = input(false);

    //######################### public methods - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
    }
}
