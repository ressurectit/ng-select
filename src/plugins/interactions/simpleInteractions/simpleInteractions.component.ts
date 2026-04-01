import {ChangeDetectionStrategy, Component, DOCUMENT, effect, ElementRef, Inject, inject, OnDestroy, Optional} from '@angular/core';
import {NoopAction, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {Subscription} from 'rxjs';

import {Interactions, InteractionsOptions, SelectFirstKeyboardAction, SelectOptionState, SelectPlugin} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {INTERACTIONS_OPTIONS} from '../../../misc/tokens';
import {handleClickOutside, selectOption, togglePopup} from '../../../misc/utils';
import {SimpleKeyboardActionTypes} from '../../../misc/types';

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
     * Subscription for all events in select bus
     */
    protected initSubscriptions: Subscription = new Subscription();

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
    public selectPlugins: SelectPluginInstances<TValue> = inject(SelectPluginInstances);

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

        this.initSubscriptions.add(this.selectBus.click.subscribe(() => togglePopup(this.selectBus)));
        this.initSubscriptions.add(this.selectBus.optionActivate.subscribe(event => selectOption(this.selectBus, event.data)));
        this.initSubscriptions.add(this.selectBus.internalsFocus.subscribe(() => this.selectBus.hasFocus.set(true)));
        this.initSubscriptions.add(this.selectBus.internalsBlur.subscribe(() => this.selectBus.hasFocus.set(false)));

        effect(() =>
        {
            const hasFocus = this.selectBus.hasFocusComputed();

            if(!hasFocus)
            {
                this.selectBus.blur.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.pluginElement.nativeElement,
                    data: null,
                });
            }
            else
            {
                this.selectBus.focus.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.pluginElement.nativeElement,
                    data: null,
                });
            }
        });

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

        effect(() =>
        {
            const optionsHandler = this.selectPlugins.optionsHandler();
            const listOptions = optionsHandler?.listOptions();
            const availableOptions = optionsHandler?.availableOptions();
            const activeOption = listOptions?.find(itm => itm.active());

            if(!activeOption)
            {
                availableOptions?.forEach(itm => itm.active.set(false));
                listOptions?.[0]?.active.set(true);
            }
        });

        this.initSubscriptions.add(this.selectBus.showPopup.subscribe(() => this.selectBus.popupVisible.set(true)));
        this.initSubscriptions.add(this.selectBus.hidePopup.subscribe(() => this.selectBus.popupVisible.set(false)));
        this.initSubscriptions.add(this.selectBus.markOption.subscribe(event =>
        {
            this.selectBus.popupVisible.set(true);
            const options = this.selectPlugins.OptionsHandler.listOptions();
            const activeOption = options?.find(itm => itm.active());

            activeOption?.active.set(false);
            event.data?.active.set(true);
        }));

        this.initSubscriptions.add((this.selectBus.keyboardAction).subscribe(event =>
        {
            switch(event.data?.type)
            {
                case 'SELECT_ACTIVE':
                {
                    const options = this.selectPlugins.OptionsHandler.listOptions();
                    const activeOption = options?.find(itm => itm.active()) as SelectOptionState<TValue>|undefined;

                    selectOption(this.selectBus, activeOption);

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
                    const e = event.data as SelectFirstKeyboardAction;
                    const textExtractor = this.selectBus.selectOptions().textExtractor;
                    const normalize = this.selectBus.selectOptions().normalize;

                    const foundOption = options?.find(itm => normalize(textExtractor(itm)).startsWith(e.search)) as SelectOptionState<TValue>|undefined;

                    if(foundOption)
                    {
                        selectOption(this.selectBus, foundOption);

                        const actOption = options?.find(itm => itm.active());

                        if(!actOption)
                        {
                            foundOption.active.set(false);
                        }
                    }

                    break;
                }
                case 'REMOVE_LAST_SELECTED_VALUE':
                {
                    if(this.selectBus.selectOptions().multiple)
                    {
                        const selectedOptions = this.selectBus.selectedOptions();

                        if(!Array.isArray(selectedOptions))
                        {
                            this.selectBus.selectedOptions.set(null);
                        }
                        else
                        {
                            const [removedOption] = selectedOptions.splice(selectedOptions.length - 1, 1);

                            if(removedOption)
                            {
                                this.selectBus.selectedOptions.set([...selectedOptions]);
                                removedOption.selected.set(false);
                            }
                        }
                    }
                    else
                    {
                        const selected = this.selectBus.selectedOptions();

                        if(!Array.isArray(selected))
                        {
                            selected?.selected.set(false);
                        }

                        this.selectBus.selectedOptions.set(null);
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
        this.initSubscriptions.unsubscribe();
    }
}
