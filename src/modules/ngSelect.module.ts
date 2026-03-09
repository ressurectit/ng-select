import {NgModule} from '@angular/core';

import {Option, OptionGroup, Select} from '../components';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        Option,
        Select,
        OptionGroup,
    ],
    exports:
    [
        Option,
        Select,
        OptionGroup,
    ],
})
export class SelectModule
{
}
