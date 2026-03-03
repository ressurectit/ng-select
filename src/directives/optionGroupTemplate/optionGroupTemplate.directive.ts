import {Directive, inject, TemplateRef} from '@angular/core';

/**
 * Directive used for obtaining template for option group in popup
 */
@Directive(
{
    selector: '[optionGroupTemplate]',
})
export class OptionGroupTemplate
{
    //######################### public properties #########################

    /**
     * Instance of template for options in popup
     */
    public template: TemplateRef<string> = inject(TemplateRef);

    //######################### ng language server #########################

    /**
     * Allows typechecking for template
     */
    static ngTemplateContextGuard(_dir: OptionGroupTemplate, _ctx: unknown): _ctx is string
    {
        return true;
    }
}
