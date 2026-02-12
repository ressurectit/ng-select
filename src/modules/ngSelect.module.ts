import {NgModule} from '@angular/core';

import {SelectValuePipe, SelectHasValuePipe} from '../pipes';
import {Option, OptGroup, Select} from '../components';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        Option,
        OptGroup,
        Select,
        SelectValuePipe,
        SelectHasValuePipe,
        // SelectAbsoluteDirective,
        // SelectControlValueAccessor,
        // SelectPlaceholderDirective,
    ],
    exports:
    [
        Option,
        OptGroup,
        Select,
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
