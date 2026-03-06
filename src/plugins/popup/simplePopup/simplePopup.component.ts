import {ChangeDetectionStrategy, Component, effect, ElementRef, Inject, inject, Optional, Signal, viewChild} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {LocalizePipe} from '@anglr/common';
import {RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

import {Popup, PopupOptions, SelectOptionState, SelectPlugin, SimplePopupCssClasses} from '../../../interfaces';
import {SelectPluginInstances, SelectBus} from '../../../misc/classes';
import {CopyOptionsAsSignal} from '../../../decorators';
import {POPUP_OPTIONS} from '../../../misc/tokens';
import {DisplayValue, GroupedListOptions} from '../../../pipes';

//TODO: hover into mouseover => use "active"

const defaultOptions: PopupOptions<SimplePopupCssClasses> =
{
    visible: false,
    liveSearchEnabled: true,
    cssClasses:
    {
        componentElement: 'popup-component',
        option: 'option',
        optionGroup: 'option-group',
        optionText: 'option-text',
        optionChecked: 'fas fa-check',
        popupContainer: 'popup-container',
    },
    texts:
    {
        noAvailableOptions: 'no options available',
    },
};

/**
 * Simple popup displaying options in column.
 */
@Component(
{
    selector: 'simple-popup',
    templateUrl: 'simplePopup.component.html',
    host:
    {
        '[class]': 'options.cssClasses.componentElement',
    },
    imports:
    [
        LocalizePipe,
        DisplayValue,
        NgTemplateOutlet,
        GroupedListOptions,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePopup<TValue = unknown> implements Popup<TValue, PopupOptions<SimplePopupCssClasses>>
{
    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    @CopyOptionsAsSignal()
    public options: PopupOptions<SimplePopupCssClasses>;

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

    //######################### protected properties - children #########################

    /**
     * Instance of element that is used as placeholder for live search
     */
    protected liveSearchPlaceholder: Signal<ElementRef<HTMLElement>|undefined|null> = viewChild('liveSearchPlaceholder', {read: ElementRef});

    //######################### constructor #########################
    constructor(@Inject(POPUP_OPTIONS) @Optional() options?: RecursivePartial<PopupOptions<SimplePopupCssClasses>>|null,)
    {
        this.options = deepCopyWithArrayOverride(defaultOptions as PopupOptions<SimplePopupCssClasses>,
                                                 options);

        effect(() =>
        {
            if(this.options.liveSearchEnabled)
            {
                const placeholder = this.liveSearchPlaceholder();

                if(!placeholder)
                {
                    return;
                }

                placeholder.nativeElement.after(this.selectPlugins.LiveSearch.pluginElement.nativeElement);
            }
        });
    }

    //######################### protected methods - template bindings #########################

    /**
     * Handles option click
     * @param option - Option that was clicked
     */
    protected optionClick(option: SelectOptionState): void
    {
        this.selectBus.optionClick.next(
        {
            source: this as SelectPlugin,
            sourceElement: this.pluginElement.nativeElement,
            data: option as SelectOptionState<TValue>,
        });
    }
}
