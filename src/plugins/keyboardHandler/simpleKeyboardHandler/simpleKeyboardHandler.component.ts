import {Component, effect, ElementRef, Inject, inject, OnDestroy, Optional} from '@angular/core';
import {LOGGER, Logger} from '@anglr/common';
import {BindThis, isPresent, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {KeyboardHandler, SimpleKeyboardHandlerOptions, SelectFirstKeyboardAction, SelectPlugin, SelectActiveKeyboardAction} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {KEYBOARD_HANDLER_OPTIONS} from '../../../misc/tokens';
import {SimpleKeyboardActionTypes} from '../../../misc/types';

const defaultOptions: SimpleKeyboardHandlerOptions =
{
    selectFirstDebounceTimeout: 300,
    alphanumericSearch: false,
};

/**
 * Simple keyboard handler, handling basic keyboard actions
 */
@Component(
{
    selector: 'simple-keyboard-handler',
    template: '',
})
export class SimpleKeyboardHandler<TValue = unknown> implements KeyboardHandler<TValue, SimpleKeyboardHandlerOptions, SimpleKeyboardActionTypes>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Searched text
     */
    protected search: string = '';

    /**
     * Debounce timeout for search
     */
    protected searchDebounceTimeout: number|undefined|null;

    /**
     * Instance of logger for logging purposes
     */
    protected logger: Logger = inject(LOGGER);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: SimpleKeyboardHandlerOptions;

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
    constructor(@Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: RecursivePartial<SimpleKeyboardHandlerOptions>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as SimpleKeyboardHandlerOptions,
                                                 options);

        effect(() =>
        {
            this.logger.verbose('Select: Keyboard handler: registering keyboard "keydown" event listener');

            this.selectBus.selectElement().nativeElement.removeEventListener('keydown', this.handleKeyboardEvents);
            this.selectBus.selectElement().nativeElement.addEventListener('keydown', this.handleKeyboardEvents);
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.logger.verbose('Select: Keyboard handler: destroying, removing keyboard "keydown" event listener, clearing search debounce timeout');
        this.selectBus.selectElement().nativeElement.removeEventListener('keydown', this.handleKeyboardEvents);

        if(isPresent(this.searchDebounceTimeout))
        {
            clearTimeout(this.searchDebounceTimeout);
        }
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
            const activeOption = options?.find(itm => itm.active());
            this.logger.verbose('Select: Keyboard handler: handling ArrowDown, ArrowUp');

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

                this.logger.verbose('Select: Keyboard handler: selecting option with index {{index}}', {index});

                this.selectBus.markOption.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: options[index],
                });
            }
            //none active before
            else if(options?.length)
            {
                this.logger.verbose('Select: Keyboard handler: selecting option with index {{index}}', {index: 0});

                this.selectBus.markOption.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: options[0],
                });
            }

            event.preventDefault();
        }

        //prevent enter if popup is opened
        if(event.key == 'Enter' && this.selectBus.popupVisible())
        {
            const activeOption = options?.find(itm => itm.active());
            this.logger.verbose('Select: Keyboard handler: handling Enter');

            if(activeOption)
            {
                this.logger.verbose('Select: Keyboard handler: selecting active option');

                this.selectBus.keyboardAction.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: <SelectActiveKeyboardAction>{type: 'SELECT_ACTIVE'},
                });
            }

            event.preventDefault();
        }

        if(event.key == 'Tab' || event.key == 'Escape')
        {
            this.logger.verbose('Select: Keyboard handler: handling Tab, Escape');

            this.selectBus.hidePopup.next(
            {
                source: this as SelectPlugin,
                sourceElement: this.selectBus.selectElement().nativeElement,
                data: null,
            });
        }

        if(event.key == ' ')
        {
            this.logger.verbose('Select: Keyboard handler: handling Space');

            this.selectBus.showPopup.next(
            {
                source: this as SelectPlugin,
                sourceElement: this.selectBus.selectElement().nativeElement,
                data: null,
            });

            event.preventDefault();
        }

        if(this.options.alphanumericSearch && event.key.match(/^[a-z0-9]$/i))
        {
            this.logger.verbose('Select: Keyboard handler: handling alphanumeric key');

            this.search += event.key;

            if(isPresent(this.searchDebounceTimeout))
            {
                clearTimeout(this.searchDebounceTimeout);
            }

            this.searchDebounceTimeout = setTimeout(() =>
            {
                this.logger.verbose('Select: Keyboard handler: seinding SELECT_FIRST keyboard action with search "{{search}}"', {search: this.search});

                this.selectBus.keyboardAction.next(
                {
                    source: this as SelectPlugin,
                    sourceElement: this.selectBus.selectElement().nativeElement,
                    data: <SelectFirstKeyboardAction>{type: 'SELECT_FIRST', search: this.search},
                });

                this.search = '';
            }, this.options.selectFirstDebounceTimeout) as unknown as number;
        }
    }
}
