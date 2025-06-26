import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonDynamicModule} from '@anglr/common';

import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {NgSelectHasValuePipe} from '../pipes/selectHasValue/ngSelectHasValue.pipe';
import {NgSelectControlValueAccessor} from '../misc/ngSelectControlValueAccessor.directive';
import {BasicNormalStateComponent} from '../plugins/normalState/basic/basicNormalState.component';
import {NoLiveSearchComponent} from '../plugins/liveSearch/no/noLiveSearch.component';
import {BasicLiveSearchComponent} from '../plugins/liveSearch/basic/basicLiveSearch.component';
import {BasicPopupComponent} from '../plugins/popup/basic/basicPopup.component';
import {DefaultPositionerComponent} from '../plugins/positioner/default/defaultPositioner.component';
import {NoPositionerComponent} from '../plugins/positioner/no/noPositioner.component';
import {BasicKeyboardHandlerComponent} from '../plugins/keyboardHandler/basic/basicKeyboardHandler.component';
import {BasicValueHandlerComponent} from '../plugins/valueHandler/basic/basicValueHandler.component';
import {OptionComponent} from '../components/option/option.component';
import {OptGroupComponent} from '../components/optionGroup/optgroup.component';
import {NgSelectComponent} from '../components/select/select.component';
import {NgSelectAbsoluteDirective} from '../directives/selectAbsolute/selectAbsolute.directive';
import {NgSelectPlaceholderDirective} from '../directives/selectPlaceholder/selectPlaceholder.directive';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgSelectValuePipe,
        CommonDynamicModule,
        NgSelectHasValuePipe,
        NgSelectAbsoluteDirective,
        NgSelectPlaceholderDirective,
        NgSelectControlValueAccessor,
    ],
    declarations:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        BasicPopupComponent,
        NoPositionerComponent,
        NoLiveSearchComponent,
        BasicLiveSearchComponent,
        BasicNormalStateComponent,
        DefaultPositionerComponent,
        BasicValueHandlerComponent,
        BasicKeyboardHandlerComponent,
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectHasValuePipe,
        NgSelectAbsoluteDirective,
        NgSelectControlValueAccessor,
        NgSelectPlaceholderDirective,
    ]
})
export class NgSelectModule
{
}