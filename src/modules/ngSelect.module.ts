import {NgModule} from '@angular/core';

import {DisplayValue, SelectHasValuePipe} from '../pipes';
import {Option, OptionGroup, Select} from '../components';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        Option,
        OptionGroup,
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
        OptionGroup,
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
