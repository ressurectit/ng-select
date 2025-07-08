import {NgModule} from '@angular/core';

import {SelectValuePipe, SelectHasValuePipe} from '../pipes';
import {NgSelectControlValueAccessor} from '../misc/ngSelectControlValueAccessor.directive';
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
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        SelectValuePipe,
        SelectHasValuePipe,
        NgSelectAbsoluteDirective,
        NgSelectControlValueAccessor,
        NgSelectPlaceholderDirective,
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        SelectValuePipe,
        SelectHasValuePipe,
        NgSelectAbsoluteDirective,
        NgSelectControlValueAccessor,
        NgSelectPlaceholderDirective,
    ]
})
export class NgSelectModule
{
}