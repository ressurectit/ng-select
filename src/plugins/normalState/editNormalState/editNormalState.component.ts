import {ChangeDetectionStrategy, Component, computed, effect, ElementRef, Inject, inject, Optional, Signal, viewChild} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {NormalState, EditNormalStateOptions, SelectPlugin, EditNormalStateCssClasses, SelectOptionState} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {NORMAL_STATE_OPTIONS} from '../../../misc/tokens';
import {DisplayValue, HasValue} from '../../../pipes';
import {NormalStateTagTemplate, NormalStateTemplate} from '../../../directives';

//TODO: improvement, carret direction

const defaultOptions: EditNormalStateOptions<EditNormalStateCssClasses> =
{
    cancelValue: true,
    carret: false,
    cssClasses:
    {
        componentElement: 'normal-state-component',
        value: 'select-align-self-center',
        tag: 'select-tag',
        carret: 'fas fa-caret-down select-align-self-center',
        cancel: '',
        cancelIcon: 'fas fa-times',
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
    protected focus(): void
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
