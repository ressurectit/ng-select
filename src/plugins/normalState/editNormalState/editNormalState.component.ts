import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, Inject, inject, Optional, Signal, viewChild} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe, TooltipDirective} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {NormalState, EditNormalStateOptions, SelectPlugin, EditNormalStateCssClasses, SelectOptionState} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {NORMAL_STATE_OPTIONS} from '../../../misc/tokens';
import {DisplayValue, HasValue} from '../../../pipes';
import {NormalStateTagTemplate, NormalStateTemplate} from '../../../directives';
import {hasValue} from '../../../misc/utils';

//TODO: improvement, carret direction

const defaultOptions: EditNormalStateOptions<EditNormalStateCssClasses> =
{
    cancelValue: true,
    carret: true,
    texts:
    {
        cancelTitle: 'cancel selected values',
    },
    cssClasses:
    {
        componentElement: 'normal-state-component',
        value: 'normal-state-value',
        tag: 'select-tag',
        carret: 'fas fa-caret-down select-align-self-center',
        cancel: 'normal-state-cancel',
        cancelIcon: 'fas fa-times select-align-self-center',
        valueWrapper: 'select-relative select-flex-1 select-flex-row select-normal-state-gap',
        valueMultiple: 'select-normal-state-gap select-flex-row',
        valueSingle: 'select-flex-1',
    },
};

/**
 * Simple normal state displaying value as 'button' that opens popup with options when clicked.
 */
@Component(
{
    selector: 'edit-normal-state',
    templateUrl: 'editNormalState.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    imports:
    [
        HasValue,
        DisplayValue,
        LocalizePipe,
        TooltipDirective,
        NgTemplateOutlet,
        NormalStateTemplate,
        NormalStateTagTemplate,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNormalState<TValue = unknown> implements NormalState<TValue, EditNormalStateOptions<EditNormalStateCssClasses>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: EditNormalStateOptions<EditNormalStateCssClasses>;

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
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### protected properties - template bindings #########################

    /**
     * Instance of selected options for multiple select
     */
    protected selectedOptionsMultiple: Signal<SelectOptionState<TValue>[]>;

    /**
     * Indication whether show value
     */
    protected showValue: Signal<boolean>;

    /**
     * Css classes applied to value element
     */
    protected cssClasses: Signal<string[]>;

    //######################### protected properties - children #########################

    /**
     * Instance of element that is used as placeholder for live search
     */
    protected liveSearchPlaceholder: Signal<ElementRef<HTMLElement>> = viewChild.required('liveSearchPlaceholder', {read: ElementRef});

    //######################### constructor #########################
    constructor(@Inject(NORMAL_STATE_OPTIONS) @Optional() options?: RecursivePartial<EditNormalStateOptions<EditNormalStateCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as EditNormalStateOptions<EditNormalStateCssClasses>,
                                                 options);

        effect(() => this.liveSearchPlaceholder().nativeElement.after(this.selectPlugins.LiveSearch.pluginElement.nativeElement));

        this.selectedOptionsMultiple = computed(() =>
        {
            const selectedOptions = this.selectBus.selectedOptions();

            if(!this.selectBus.selectOptions().multiple || !Array.isArray(selectedOptions))
            {
                return [];
            }

            return selectedOptions;
        });

        this.showValue = computed(() => ((hasValue(this.selectBus.selectedOptions()) || !this.selectBus.selectOptions().multiple) &&
                                         (this.selectPlugins.liveSearch()?.emptyInput() || this.selectBus.selectOptions().multiple)) ||
                                        (!this.selectBus.selectOptions().multiple && !hasValue(this.selectBus.selectedOptions()) && !this.selectPlugins.liveSearch()?.emptyInput()));

        this.cssClasses = computed(() => [this.options.cssClasses.value,
                                          ...(this.selectBus.selectOptions().multiple ? [...this.options.cssClasses.valueMultiple.split(' ')] : [...this.options.cssClasses.valueSingle.split(' ')])]);
    }

    //######################### public methods - implementation of LiveSearch #########################

    /**
     * @inheritdoc
     */
    public focus(): void
    {
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

    /**
     * Handles option click
     * @param option - Option that was clicked
     */
    protected optionClick(option: SelectOptionState<TValue>): void
    {
        this.selectBus.optionActivate.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: option,
        });
    }
}
