import {Component, effect, ElementRef, Inject, inject, OnDestroy, Optional} from '@angular/core';
import {BindThis, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {HidePopupKeyboardAction, KeyboardHandler, KeyboardHandlerOptions, MarkActiveKeyboardAction, SelectActiveKeyboardAction, SelectPlugin, ShowPopupKeyboardAction} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {KEYBOARD_HANDLER_OPTIONS} from '../../../misc/tokens';
import {SimpleKeyboardActionTypes} from '../../../misc/types';

const defaultOptions: KeyboardHandlerOptions =
{
};

/**
 * Simple keyboard handler, handling basic keyboard actions
 */
@Component(
{
    selector: 'simple-keyboard-handler',
    template: '',
})
export class SimpleKeyboardHandlerComponent<TValue = unknown> implements KeyboardHandler<TValue, KeyboardHandlerOptions, SimpleKeyboardActionTypes>, OnDestroy
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: KeyboardHandlerOptions;

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
    constructor(@Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<KeyboardHandlerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as KeyboardHandlerOptions,
                                                 options);

        effect(() =>
        {
            this.selectBus.selectElement().nativeElement.removeEventListener('keydown', this.handleKeyboardEvents);
            this.selectBus.selectElement().nativeElement.addEventListener('keydown', this.handleKeyboardEvents);
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
        this.selectBus.selectElement().nativeElement.removeEventListener('keydown', this.handleKeyboardEvents);
    }

    //######################### protected methods #########################

    /**
     * Handles keyboard events
     * @param event - Keyboard event that occured
     */
    @BindThis
    protected handleKeyboardEvents(event: KeyboardEvent): void
    {
        const options = this.selectPlugins.OptionsHandler.listOptions();

        if(event.key == 'ArrowDown' || event.key == 'ArrowUp')
        {
            const activeOption = options?.find(itm => itm.active);

            if(activeOption && options)
            {
                let index = options.indexOf(activeOption);

                //move down cursor
                if(event.key == 'ArrowDown')
                {
                    index += 1;
                }
                //move up cursor
                else
                {
                    index -= 1;
                }

                if(index < 0)
                {
                    index = options.length - 1;
                }

                index = index % options.length;

                this.selectBus.keyboardAction.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: <MarkActiveKeyboardAction>{type: 'MARK_ACTIVE', index},
                });
            }
            //none active before
            else if(options?.length)
            {
                this.selectBus.keyboardAction.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: <MarkActiveKeyboardAction>{type: 'MARK_ACTIVE', index: 0},
                });
            }

            event.preventDefault();
        }

        //prevent enter if popup is opened
        if(event.key == 'Enter' && this.selectBus.popupVisible())
        {
            const activeOption = options?.find(itm => itm.active);

            if(activeOption)
            {
                this.selectBus.keyboardAction.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: <SelectActiveKeyboardAction>{type: 'SELECT_ACTIVE', option: activeOption},
                });
            }

            event.preventDefault();
        }

        if(event.key == 'Tab' || event.key == 'Escape')
        {
            this.selectBus.keyboardAction.next(
            {
                source: this as SelectPlugin,
                sourceElement: this.selectBus.selectElement().nativeElement,
                data: <HidePopupKeyboardAction>{type: 'HIDE_POPUP'},
            });
        }

        if(event.key == ' ')
        {
            this.selectBus.keyboardAction.next(
            {
                source: this as SelectPlugin,
                sourceElement: this.selectBus.selectElement().nativeElement,
                data: <ShowPopupKeyboardAction>{type: 'SHOW_POPUP'},
            });

            event.preventDefault();
        }
    }
}
