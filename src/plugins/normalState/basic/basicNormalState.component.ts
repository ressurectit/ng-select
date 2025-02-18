import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {StringLocalization, STRING_LOCALIZATION} from '@anglr/common';
import {extend} from '@jscrpt/common/extend';

import {BasicNormalStateOptions, BasicNormalState, CssClassesBasicNormalState} from './basicNormalState.interface';
import {NgSelectPlugin} from '../../../misc';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {NORMAL_STATE_OPTIONS} from '../types';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';
import {NormalStateAbstractComponent} from '../normalStateAbstract.component';

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: BasicNormalStateOptions =
{
    cssClasses:
    {
        normalStateElement: 'btn btn-select',
        selectedCarret: 'selected-caret fa fa-caret-down',
        selectedValue: 'selected-value'
    },
    texts:
    {
        nothingSelected: 'Nothing selected'
    },
    optionDisplayText: option => option.text
};

/**
 * Component used for rendering basic simple normal state of select
 */
@Component(
{
    selector: 'div.normal-state',
    templateUrl: 'basicNormalState.component.html',
    styleUrl: 'basicNormalState.component.css',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicNormalStateComponent<TValue = any> extends NormalStateAbstractComponent<CssClassesBasicNormalState, BasicNormalStateOptions<TValue>, TValue> implements BasicNormalState, NgSelectPlugin<BasicNormalStateOptions>, OnDestroy
{
    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                @Optional() pluginBus: PluginBus,
                pluginElement: ElementRef,
                changeDetector: ChangeDetectorRef,
                @Inject(STRING_LOCALIZATION) stringLocalization: StringLocalization,
                @Inject(NORMAL_STATE_OPTIONS) @Optional() options?: BasicNormalStateOptions)
    {
        super(ngSelectPlugins, pluginBus, pluginElement, changeDetector, stringLocalization);

        this._options = extend(true, {}, defaultOptions, options);
    }
}
