import {Directive, effect, inject, input, InputSignal, model, ModelSignal, OnDestroy, untracked} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import {LOGGER, Logger} from '@anglr/common';
import {isEqual} from 'lodash-es';
import {Subscription} from 'rxjs';

import {Select} from '../../components/select/select.component';
import {SelectPluginType} from '../../misc/enums';

/**
 * Form value control for Select
 */
@Directive(
{
    selector: 'ng-select[formField]',
})
export class SelectFormControl<TValue = unknown> implements FormValueControl<TValue|TValue[]|undefined|null>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of logger for logging purposes
     */
    protected logger: Logger = inject(LOGGER);

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    //######################### public properties - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public readonly value: ModelSignal<TValue|TValue[]|null|undefined> = model<TValue|TValue[]|null|undefined>(undefined);

    /**
     * @inheritdoc
     */
    public checked: undefined;

    /**
     * @inheritdoc
     */
    public readonly disabled: InputSignal<boolean> = input(false);

    /**
     * @inheritdoc
     */
    public readonly readonly: InputSignal<boolean> = input(false);

    /**
     * @inheritdoc
     */
    public readonly touched: ModelSignal<boolean> = model(false);

    //######################### constructor #########################
    constructor(protected select: Select<TValue>)
    {
        this.initSubscriptions.add(this.select.events.focus.subscribe(() => this.touched.set(true)));

        effect(() => this.select.selectOptions.readonly = this.disabled() || this.readonly());

        effect(() =>
        {
            if(!this.select.initialized())
            {
                return;
            }

            const value = this.value();
            this.logger.verbose('Select: Form control: control value changed "{{@(4)value}}"', {value});

            untracked(() =>
            {
                if(!isEqual(this.select.getPlugin(SelectPluginType.ValueHandler).value(), value))
                {
                    this.logger.verbose('Select: Form control: setting select value "{{@(4)value}}"', {value});
                    this.select.getPlugin(SelectPluginType.ValueHandler).setValue(value);
                }
            });
        });

        effect(() =>
        {
            if(!this.select.initialized())
            {
                return;
            }

            const value = this.select.getPlugin(SelectPluginType.ValueHandler).value();
            this.logger.verbose('Select: Form control: select value changed "{{@(4)value}}"', {value});

            untracked(() =>
            {
                if(!isEqual(this.value(), value))
                {
                    this.logger.verbose('Select: Form control: setting control value "{{@(4)value}}"', {value});
                    this.value.set(value);
                }
            });
        });
    }

    //######################### public methods - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
        this.select.events.setFocus();
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
    }
}
