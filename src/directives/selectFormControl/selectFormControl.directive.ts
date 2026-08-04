import {Directive, effect, inject, input, InputSignal, model, ModelSignal, OnDestroy, untracked} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import {LOGGER, Logger} from '@anglr/common';
import {nameof} from '@jscrpt/common';
import {isEqual} from 'lodash-es';
import {Subscription} from 'rxjs';

import {Select} from '../../components/select/select.component';
import {SelectPluginType} from '../../misc/enums';
import {TempValue} from '../../interfaces';

/**
 * Form value control for Select
 */
@Directive(
{
    selector: 'ng-select[formField]',
})
export class SelectFormControl<TValue = unknown, TPublicValue = TValue> implements FormValueControl<TPublicValue|TPublicValue[]|undefined|null>, OnDestroy
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

    /**
     * Temporary value used for storing value during async write
     */
    protected tmpValue: TempValue<TPublicValue|TPublicValue[]> = {};

    //######################### public properties - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public readonly value: ModelSignal<TPublicValue|TPublicValue[]|null|undefined> = model<TPublicValue|TPublicValue[]|null|undefined>(undefined);

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
    constructor(protected select: Select<TValue, TPublicValue>)
    {
        this.initSubscriptions.add(this.select.events.focus.subscribe(() => this.touched.set(true)));

        effect(() => this.select.selectOptions.readonly = this.disabled() || this.readonly());

        //setting value
        effect(() =>
        {
            if(!this.select.initialized())
            {
                return;
            }

            const value = this.value();
            this.logger.verbose('Select: Form control: control value changed "{{@(4)value}}"', {value});

            untracked(async () =>
            {
                if(!isEqual(this.select.getPlugin(SelectPluginType.ValueHandler).value(), value))
                {
                    this.tmpValue.value = value;
                    this.logger.verbose('Select: Form control: setting select value "{{@(4)value}}"', {value});
                    await this.select.getPlugin(SelectPluginType.ValueHandler).setValue(value);
                    delete this.tmpValue.value;
                }
            });
        });

        //getting value
        effect(() =>
        {
            if(!this.select.initialized())
            {
                return;
            }

            let value = this.select.getPlugin(SelectPluginType.ValueHandler).value();
            this.logger.verbose('Select: Form control: select value changed "{{@(4)value}}"', {value});

            if(nameof<TempValue<TPublicValue|TPublicValue[]>>('value') in this.tmpValue)
            {
                value = this.tmpValue.value;
            }

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
