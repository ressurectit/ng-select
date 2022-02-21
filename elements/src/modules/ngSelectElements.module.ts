import {NgModule, DoBootstrap, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';
import {CommonDynamicModule} from '@anglr/common';
import {NgSelectModule, OptionComponent} from '@anglr/select';

import {NgSelectElementsComponent} from '../components/ngSelectElements.component';

/**
 * Represents module for WebComponent NgSelect
 */
@NgModule(
{
    imports:
    [
        BrowserModule,
        CommonModule,
        CommonDynamicModule,
        NgSelectModule,
    ],
    declarations:
    [
        NgSelectElementsComponent
    ]
})
export class NgSelectElementsModule implements DoBootstrap
{
    //######################### constructor #########################
    constructor(injector: Injector) 
    {
        const ngOption = createCustomElement(OptionComponent, {injector});
        customElements.define('ng-option', ngOption);

        const ngSelect = createCustomElement(NgSelectElementsComponent, {injector});
        customElements.define('ng-select', ngSelect);
    }

    //######################### public methods - implementation of DoBootstrap #########################
    
    /**
     * Called during bootstrapping of module
     */
    public ngDoBootstrap()
    {
    }
}