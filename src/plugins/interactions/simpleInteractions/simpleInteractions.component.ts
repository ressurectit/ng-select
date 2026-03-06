import {ChangeDetectionStrategy, Component, DOCUMENT, effect, ElementRef, Inject, inject, OnDestroy, Optional} from '@angular/core';
import {NoopAction, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {Observable, Subscription} from 'rxjs';

import {Interactions, InteractionsOptions, SelectEvent, SelectOptionState} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {INTERACTIONS_OPTIONS} from '../../../misc/tokens';
import {handleClickOutside, selectOption, togglePopup} from '../../../misc/utils';
import {SimpleKeyboardActions, SimpleKeyboardActionTypes} from '../../../misc/types';

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
export class SimpleInteractions<TValue = unknown> implements Interactions<TValue, InteractionsOptions, SimpleKeyboardActionTypes>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscription for popup visible toggle
     */
    protected clickPopupVisibleToggle: Subscription = new Subscription();

    /**
     * Subscription for keyboard actions
     */
    protected keyboardActions: Subscription = new Subscription();

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
    public selectBus: SelectBus<TValue, SimpleKeyboardActionTypes> = inject(SelectBus) as SelectBus<TValue, SimpleKeyboardActionTypes>;

    //######################### constructor #########################
    constructor(@Inject(INTERACTIONS_OPTIONS) @Optional() options?: RecursivePartial<InteractionsOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as InteractionsOptions,
                                                 options);

        this.clickPopupVisibleToggle.add(this.selectBus.click.subscribe(() => togglePopup(this.selectBus)));
        this.optionClick.add(this.selectBus.optionClick.subscribe(event => selectOption(this.selectBus, this.selectPlugins, event.data)));

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

        this.keyboardActions.add((this.selectBus.keyboardAction as Observable<SelectEvent<SimpleKeyboardActions>>).subscribe(event =>
        {
            switch(event.data?.type)
            {
                case 'SHOW_POPUP':
                {
                    this.selectBus.popupVisible.set(true);

                    break;
                }
                case 'HIDE_POPUP':
                {
                    this.selectBus.popupVisible.set(false);

                    break;
                }
                case 'MARK_ACTIVE':
                {
                    this.selectBus.popupVisible.set(true);
                    const options = this.selectPlugins.OptionsHandler.listOptions();
                    const activeOption = options?.find(itm => itm.active());

                    activeOption?.active.set(false);
                    options?.[event.data?.index ?? 0].active.set(true);

                    break;
                }
                case 'SELECT_ACTIVE':
                {
                    const options = this.selectPlugins.OptionsHandler.listOptions();
                    const activeOption = options?.find(itm => itm.active()) as SelectOptionState<TValue>|undefined;

                    selectOption(this.selectBus, this.selectPlugins, activeOption);

                    const actOption = options?.find(itm => itm.active());

                    if(!actOption)
                    {
                        activeOption?.active.set(false);
                    }

                    break;
                }
                case 'SELECT_FIRST':
                {
                    const options = this.selectPlugins.OptionsHandler.listOptions() as SelectOptionState<TValue>[]|null|undefined;
                    const e = event.data;
                    const textExtractor = this.selectBus.selectOptions().textExtractor;
                    const normalize = this.selectBus.selectOptions().normalize;

                    const foundOption = options?.find(itm => normalize(textExtractor(itm)).startsWith(e.search)) as SelectOptionState<TValue>|undefined;

                    if(foundOption)
                    {
                        selectOption(this.selectBus, this.selectPlugins, foundOption);

                        const actOption = options?.find(itm => itm.active());

                        if(!actOption)
                        {
                            foundOption.active.set(false);
                        }
                    }

                    break;
                }
            }
        }));
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.clickOutsideUnregister?.();
        this.clickPopupVisibleToggle.unsubscribe();
        this.keyboardActions.unsubscribe();
        this.optionClick.unsubscribe();
    }
}
