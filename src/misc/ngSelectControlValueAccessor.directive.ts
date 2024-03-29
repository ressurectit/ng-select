import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Subscription} from 'rxjs';

import {NgSelectComponent} from '../components/select/select.component';
import {ɵValueChange, ɵSetValue, ɵOnFocus, ɵSetReadonly, ɵGetValue} from '../misc/extensions';

/**
 * Provider for control value accessor
 * @internal
 */
const NG_SELECT_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectControlValueAccessor),
    multi: true
};

/**
 * Control value accessor for NgSelectComponent
 */
@Directive(
{
    selector: 'ng-select[formControlName],ng-select[formControl],ng-select[ngModel]',
    providers: [NG_SELECT_VALUE_ACCESSOR]
})
export class NgSelectControlValueAccessor<TValue = any> implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for initialized status of NgSelect, used for writeValue
     */
    private _initializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for registerOnChange
     */
    private _changeInitializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for registerOnTouched
     */
    private _touchInitializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for setDisabledState
     */
    private _disabledInitializedSubscription: Subscription;

    /**
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;

    /**
     * Subscription that looks for changes of select
     */
    private _focusSubscription: Subscription = null;

    /**
     * Last set value to this control
     */
    private _value: TValue|TValue[];

    //######################### constructor #########################
    constructor(private _select: NgSelectComponent<TValue>)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: TValue|Array<TValue>): void
    {
        this._value = value;

        if(this._select.isInitialized)
        {
            this._select.execute(ɵSetValue(value));

            return;
        }

        if(this._initializedSubscription)
        {
            this._initializedSubscription.unsubscribe();
            this._initializedSubscription = null;
        }

        this._initializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                this._initializedSubscription.unsubscribe();
                this._initializedSubscription = null;

                this._select.execute(ɵSetValue(value));
            }
        });
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: TValue|Array<TValue>) => void): void
    {
        const fnWrapper = (value: TValue|Array<TValue>) =>
        {
            //multivalue is new array in case of change
            if(Array.isArray(value) && Array.isArray(this._value))
            {
                if(value !== this._value)
                {
                    this._value = value;
                    fn(value);
                }
            }
            else if(!Array.isArray(value) && !Array.isArray(this._value))
            {
                if(!this._select.selectOptions?.valueComparer(this._value, value))
                {
                    this._value = value;
                    fn(value);
                }
            }
        };

        this._changeInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                if(this._changeSubscription)
                {
                    this._changeSubscription.unsubscribe();
                    this._changeSubscription = null;
                }

                this._changeSubscription = this._select.executeAndReturn(ɵValueChange(fnWrapper));

                if(this._select.selectOptions.forceValueCheckOnInit)
                {
                    const value = this._select.executeAndReturn(ɵGetValue());

                    fnWrapper(value);
                }
            }
        });
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(fn: () => void): void
    {
        this._touchInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                if(this._focusSubscription)
                {
                    this._focusSubscription.unsubscribe();
                    this._focusSubscription = null;
                }

                this._focusSubscription = this._select.executeAndReturn(ɵOnFocus(fn));
            }
        });
    }

    /**
     * Sets NgSelect as disabled/readonly
     * @param isDisabled - Indication whether is control disabled or not
     */
    public setDisabledState(isDisabled: boolean): void
    {
        if(this._select.isInitialized)
        {
            this._select.execute(ɵSetReadonly(isDisabled));

            return;
        }

        if(this._disabledInitializedSubscription)
        {
            this._disabledInitializedSubscription.unsubscribe();
            this._disabledInitializedSubscription = null;
        }

        this._disabledInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                this._disabledInitializedSubscription.unsubscribe();
                this._disabledInitializedSubscription = null;

                this._select.execute(ɵSetReadonly(isDisabled));
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._changeSubscription)
        {
            this._changeSubscription.unsubscribe();
            this._changeSubscription = null;
        }

        if(this._initializedSubscription)
        {
            this._initializedSubscription.unsubscribe();
            this._initializedSubscription = null;
        }

        if(this._changeInitializedSubscription)
        {
            this._changeInitializedSubscription.unsubscribe();
            this._changeInitializedSubscription = null;
        }

        if(this._touchInitializedSubscription)
        {
            this._touchInitializedSubscription.unsubscribe();
            this._touchInitializedSubscription = null;
        }

        if(this._focusSubscription)
        {
            this._focusSubscription.unsubscribe();
            this._focusSubscription = null;
        }

        if(this._disabledInitializedSubscription)
        {
            this._disabledInitializedSubscription.unsubscribe();
            this._disabledInitializedSubscription = null;
        }
    }
}