import {forwardRef, ExistingProvider, Directive, OnDestroy, WritableSignal, signal, effect, untracked} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Action1, NoopAction} from '@jscrpt/common';
import {isEqual} from 'lodash-es';
import {Subscription} from 'rxjs';

import {SelectPluginType} from '../../misc/enums';
import {Select} from '../../components/select/select.component';

/**
 * Provider for control value accessor
 */
const SELECT_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessor),
    multi: true,
};

/**
 * Control value accessor for Select
 */
@Directive(
{
    selector: 'ng-select[formControlName],ng-select[formControl],ng-select[ngModel]',
    providers: [SELECT_VALUE_ACCESSOR],
})
export class SelectControlValueAccessor<TValue = unknown> implements ControlValueAccessor, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    /**
     * Last set value to this control
     */
    protected value: WritableSignal<TValue|TValue[]|undefined|null> = signal(undefined);

    /**
     * Indication whether disable Select
     */
    protected disabled: WritableSignal<boolean> = signal(false);

    /**
     * On change callback for setting value back to control
     */
    protected onChange: Action1<TValue|Array<TValue>|undefined|null>|undefined|null;

    /**
     * On touched callback for setting touched back to control
     */
    protected onTouched: NoopAction|undefined|null;

    //######################### constructor #########################
    constructor(select: Select<TValue>)
    {
        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            select.getPlugin(SelectPluginType.ValueHandler).setValue(this.value());
        });

        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            select.selectOptions.readonly = this.disabled();
        });

        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            const value = select.getPlugin(SelectPluginType.ValueHandler).value();

            untracked(() =>
            {
                if(!isEqual(value, this.value()))
                {
                    this.onChange?.(value);
                }
            });
        });

        this.initSubscriptions.add(select.events.focus.subscribe(() => this.onTouched?.()));
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * @inheritdoc
     */
    public writeValue(value: TValue|TValue[]|undefined|null): void
    {
        this.value.set(value);
    }

    /**
     * @inheritdoc
     */
    public registerOnChange(fn: (data: TValue|Array<TValue>|undefined|null) => void): void
    {
        this.onChange = fn;
    }

    /**
     * @inheritdoc
     */
    public registerOnTouched(fn: () => void): void
    {
        this.onTouched = fn;
    }

    /**
     * @inheritdoc
     */
    public setDisabledState(isDisabled: boolean): void
    {
        this.disabled.set(isDisabled);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy()
    {
        this.initSubscriptions.unsubscribe();
    }
}
