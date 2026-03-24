import {Directive, inject, TemplateRef} from '@angular/core';

import {PopupContext} from '../../interfaces';

/**
 * Directive used for obtaining template for option in popup
 */
@Directive(
{
    selector: '[optionTemplate]',
    exportAs: 'optionTemplate',
})
export class OptionTemplate
{
    //######################### public properties #########################

    /**
     * Instance of template for options in popup
     */
    public template: TemplateRef<PopupContext<any>> = inject(TemplateRef);

    //######################### ng language server #########################

    /**
     * Allows typechecking for template
     */
    static ngTemplateContextGuard(_dir: OptionTemplate, _ctx: unknown): _ctx is PopupContext<any>
    {
        return true;
    }
}
