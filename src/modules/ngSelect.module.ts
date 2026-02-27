import {NgModule} from '@angular/core';

import {DisplayValue, SelectHasValuePipe} from '../pipes';
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
        DisplayValue,
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
        DisplayValue,
        SelectHasValuePipe,
        // NgSelectAbsoluteDirective,
        // NgSelectControlValueAccessor,
        // NgSelectPlaceholderDirective,
    ]
})
export class SelectModule
{
}
