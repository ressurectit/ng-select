import {ChangeDetectionStrategy, Component, ElementRef, Inject, inject, Optional} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe, TooltipDirective} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {NormalState, NormalStateOptions, SelectPlugin, SimpleNormalStateCssClasses} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {NORMAL_STATE_OPTIONS} from '../../../misc/tokens';
import {DisplayValue} from '../../../pipes';

//TODO: improvement, carret direction

const defaultOptions: NormalStateOptions<SimpleNormalStateCssClasses> =
{
    cancelValue: false,
    cssClasses:
    {
        componentElement: 'normal-state-component',
        containerElement: 'select-normal-state select-flex-row select-flex-1',
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
    selector: 'simple-normal-state',
    templateUrl: 'simpleNormalState.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    imports:
    [
        DisplayValue,
        LocalizePipe,
        TooltipDirective,
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleNormalState<TValue = unknown> implements NormalState<TValue, NormalStateOptions<SimpleNormalStateCssClasses>>
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
    public selectPlugins: SelectPluginInstances<TValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### constructor #########################
    constructor(@Inject(NORMAL_STATE_OPTIONS) @Optional() options?: RecursivePartial<NormalStateOptions<SimpleNormalStateCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as NormalStateOptions<SimpleNormalStateCssClasses>,
                                                 options);
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
        });
    }

    /**
     * Handles focus event
     */
    protected focus(): void
    {
        this.selectBus.focus.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
        });
    }

    /**
     * Handles cancel value
     */
    protected cancel(): void
    {
        this.selectBus.optionClick.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
        });
    }
}
