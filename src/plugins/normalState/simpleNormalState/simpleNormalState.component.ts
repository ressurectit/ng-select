import {ChangeDetectionStrategy, Component, computed, ElementRef, Inject, inject, Optional, Signal, viewChild} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe, TooltipDirective} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {NormalState, NormalStateOptions, SelectPlugin, SimpleNormalStateCssClasses} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {NORMAL_STATE_OPTIONS} from '../../../misc/tokens';
import {DisplayValue, HasValue} from '../../../pipes';

//TODO: improvement, carret direction

const defaultOptions: NormalStateOptions<SimpleNormalStateCssClasses> =
{
    cancelValue: false,
    texts:
    {
        cancelTitle: 'cancel selected values',
    },
    cssClasses:
    {
        componentElement: 'normal-state-component',
        element: 'normal-state-element',
        value: 'select-align-self-center',
        carret: 'normal-state-carret',
        carretIcon: 'fas fa-caret-down select-align-self-center',
        cancel: 'normal-state-cancel',
        cancelIcon: 'fas fa-times select-align-self-center',
    },
};

/**
 * Simple normal state displaying value as 'button' that opens popup with options when clicked.
 */
@Component(
{
    selector: 'simple-normal-state',
    templateUrl: 'simpleNormalState.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
        '[class.disabled]': '!!selectBus.selectOptions().readonly',
    },
    imports:
    [
        HasValue,
        DisplayValue,
        LocalizePipe,
        TooltipDirective,
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleNormalState<TValue = unknown, TPublicValue = TValue> implements NormalState<TValue, TPublicValue, NormalStateOptions<SimpleNormalStateCssClasses>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: NormalStateOptions<SimpleNormalStateCssClasses>;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue, TPublicValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue, TPublicValue> = inject(SelectBus);

    //######################### protected properties - template bindings #########################

    /**
     * Active descendant for aria-activedescendant attribute
     */
    protected activeDescendant: Signal<string>;

    //######################### protected properties - children #########################

    /**
     * Reference to button element in template
     */
    protected htmlButton: Signal<ElementRef<HTMLButtonElement>> = viewChild.required('htmlButton', {read: ElementRef});

    //######################### constructor #########################
    constructor(@Inject(NORMAL_STATE_OPTIONS) @Optional() options?: RecursivePartial<NormalStateOptions<SimpleNormalStateCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as NormalStateOptions<SimpleNormalStateCssClasses>,
                                                 options);

        this.activeDescendant = computed(() => `${this.selectBus.id}-${this.selectPlugins.optionsHandler()?.listOptions()?.find(option => option.active())?.index}`);
    }

    //######################### public methods - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
        this.htmlButton()?.nativeElement.focus();
    }

    //######################### protected methods - template bindings #########################

    /**
     * Handles click event
     */
    protected click(): void
    {
        this.selectBus.click.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles focus event
     */
    protected handleFocus(): void
    {
        this.selectBus.internalsFocus.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles blur event
     */
    protected blur(): void
    {
        this.selectBus.internalsBlur.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }

    /**
     * Handles cancel value
     */
    protected cancel(): void
    {
        this.selectBus.optionActivate.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: null,
        });
    }
}
