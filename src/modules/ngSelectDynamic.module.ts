import {NgModule} from '@angular/core';

import {DynamicValueHandlerComponent} from '../plugins/valueHandler/dynamic/dynamicValueHandler.component';

/**
 * Module for select and its options, allows use of dynamic value handler
 */
@NgModule(
{
    declarations:
    [
        DynamicValueHandlerComponent,
    ]
})
export class NgSelectDynamicModule
{
}