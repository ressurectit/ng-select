import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonDynamicModule} from '@anglr/common';

import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {NgSelectHasValuePipe} from '../pipes/ngSelectHasValue.pipe';
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
import {OptGroupComponent} from '../components/option/optgroup.component';
import {NgSelectComponent} from '../components/select/select.component';
import {NgSelectAbsoluteDirective} from '../directives/ngSelectAbsolute/ngSelectAbsolute.directive';
import {NgSelectPlaceholderDirective} from '../directives/ngSelectPlaceholder/ngSelectPlaceholder.directive';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        CommonDynamicModule,
    ],
    declarations:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectHasValuePipe,
        NgSelectControlValueAccessor,
        BasicNormalStateComponent,
        NoLiveSearchComponent,
        BasicLiveSearchComponent,
        BasicPopupComponent,
        NoPositionerComponent,
        DefaultPositionerComponent,
        BasicKeyboardHandlerComponent,
        BasicValueHandlerComponent,
        NgSelectAbsoluteDirective,
        NgSelectPlaceholderDirective
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectHasValuePipe,
        NgSelectControlValueAccessor,
        NgSelectAbsoluteDirective,
        NgSelectPlaceholderDirective
    ]
})
export class NgSelectModule
{
}