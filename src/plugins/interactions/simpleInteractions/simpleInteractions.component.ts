import {ChangeDetectionStrategy, Component, DOCUMENT, effect, ElementRef, Inject, inject, OnDestroy, Optional} from '@angular/core';
import {NoopAction, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {Subscription} from 'rxjs';

import {Interactions, InteractionsOptions} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {INTERACTIONS_OPTIONS} from '../../../misc/tokens';
import {handleClickOutside, handleOptionClick, togglePopupOnClick} from '../../../misc/utils';

const defaultOptions: InteractionsOptions =
{
};

/**
 * Provides simple interactions within select among plugins
 */
@Component(
{
    selector: 'simple-interactions',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleInteractions<TValue = unknown> implements Interactions<TValue, InteractionsOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscription for popup visible toggle
     */
    protected clickPopupVisibleToggle: Subscription = new Subscription();

    /**
     * Subscription for option click
     */
    protected optionClick: Subscription = new Subscription();

    /**
     * Instance of HTML document
     */
    protected document: Document = inject(DOCUMENT);

    /**
     * Method used for unregistering click outside handler
     */
    protected clickOutsideUnregister: NoopAction|undefined|null;

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: InteractionsOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus) as SelectBus<TValue>;

    //######################### constructor #########################
    constructor(@Inject(INTERACTIONS_OPTIONS) @Optional() options?: RecursivePartial<InteractionsOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as InteractionsOptions,
                                                 options);

        togglePopupOnClick(this.selectBus, this.clickPopupVisibleToggle);
        handleOptionClick(this.selectBus, this.selectPlugins, this.optionClick);

        effect(() =>
        {
            const popupVisible = this.selectBus.popupVisible();

            this.clickOutsideUnregister?.();

            if(popupVisible)
            {
                this.clickOutsideUnregister = handleClickOutside(this.document, this.selectBus, this.selectPlugins);
            }
            else
            {
                this.clickOutsideUnregister = null;
            }
        });
    }

    //######################### public methods - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    public initialize(): void
    {
    }

    /**
     * @inheritdoc
     */
    public initOptions(): void
    {
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.clickPopupVisibleToggle.unsubscribe();
        this.optionClick.unsubscribe();
    }
}
