import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, Optional} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {STRING_LOCALIZATION, StringLocalization} from '@anglr/common';
import {extend} from '@jscrpt/common/extend';

import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {NgSelectPlugin} from '../../../misc';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {PopupAbstractComponent} from '../popupAbstract.component';
import {POPUP_OPTIONS} from '../types';
import {CssClassesEditPopup, EditPopup, EditPopupOptions} from './editPopup.interface';
import {ɵNgSelectOption} from '../../../components/option';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: EditPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    texts:
    {
        noAvailableOptions: 'No items found'
    },
    visible: false
};

/**
 * Component used for rendering edit popup with options
 */
@Component(
{
    selector: 'div.ng-select-edit-popup',
    templateUrl: 'editPopup.component.html',
    styleUrl: 'editPopup.component.css',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPopupComponent extends PopupAbstractComponent<CssClassesEditPopup, EditPopupOptions> implements EditPopup, NgSelectPlugin<EditPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Gets indication whether keep open popup after value change
     */
    protected override get keepOpen(): boolean
    {
        return false;
    }

    /**
     * Gets all options
     */
    protected get allOptions(): ɵNgSelectOption[]
    {
        return this.pluginBus.selectOptions.optionsGatherer.options;
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                @Optional() pluginBus: PluginBus,
                pluginElement: ElementRef,
                changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options: EditPopupOptions,
                @Inject(STRING_LOCALIZATION) stringLocalization: StringLocalization,
                @Inject(DOCUMENT) document?: Document)
    {
        super(ngSelectPlugins, pluginBus, pluginElement, changeDetector, document, stringLocalization);

        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles mouse move and changes active option
     * @param option - Option to be set as active
     * @internal
     */
    public handleMouseActivation(option: ɵNgSelectOption): void
    {
        this.allOptions.forEach(option => option.active = false);

        option.active = true;
    }
}
