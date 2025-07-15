import {NgModule} from '@angular/core';

import {SelectValuePipe, SelectHasValuePipe} from '../pipes';
import {OptionComponent, OptGroupComponent, SelectComponent} from '../components';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        OptionComponent,
        OptGroupComponent,
        SelectComponent,
        SelectValuePipe,
        SelectHasValuePipe,
        // SelectAbsoluteDirective,
        // SelectControlValueAccessor,
        // SelectPlaceholderDirective,
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        SelectComponent,
        SelectValuePipe,
        SelectHasValuePipe,
        // NgSelectAbsoluteDirective,
        // NgSelectControlValueAccessor,
        // NgSelectPlaceholderDirective,
    ]
})
export class SelectModule
{
}
