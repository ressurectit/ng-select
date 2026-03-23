import {ChangeDetectionStrategy, Component, effect, ElementRef, Inject, inject, Optional, Signal, viewChild} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {NormalState, NormalStateOptions, SelectPlugin, EditNormalStateCssClasses} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {NORMAL_STATE_OPTIONS} from '../../../misc/tokens';
import {DisplayValue} from '../../../pipes';

//TODO: improvement, carret direction

const defaultOptions: NormalStateOptions<EditNormalStateCssClasses> =
{
    cancelValue: false,
    cssClasses:
    {
        componentElement: 'normal-state-component',
        element: 'select-normal-state select-flex-row select-flex-1',
        value: 'select-flex-1 select-align-self-center',
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
        DisplayValue,
        LocalizePipe,
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNormalState<TValue = unknown> implements NormalState<TValue, NormalStateOptions<EditNormalStateCssClasses>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: NormalStateOptions<EditNormalStateCssClasses>;

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

    //######################### protected properties - children #########################

    /**
     * Instance of element that is used as placeholder for live search
     */
    protected liveSearchPlaceholder: Signal<ElementRef<HTMLElement>> = viewChild.required('liveSearchPlaceholder', {read: ElementRef});

    //######################### constructor #########################
    constructor(@Inject(NORMAL_STATE_OPTIONS) @Optional() options?: RecursivePartial<NormalStateOptions<EditNormalStateCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as NormalStateOptions<EditNormalStateCssClasses>,
                                                 options);

        effect(() => this.liveSearchPlaceholder().nativeElement.after(this.selectPlugins.LiveSearch.pluginElement.nativeElement));
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
}
