import {Directive, inject, TemplateRef} from '@angular/core';

import {NormalStateTagContext} from '../../interfaces';

/**
 * Directive used for obtaining template for normal state tag
 */
@Directive(
{
    selector: '[normalStateTagTemplate]',
    exportAs: 'normalStateTagTemplate,',
})
export class NormalStateTagTemplate
{
    //######################### public properties #########################

    /**
     * Instance of template for normal state tag
     */
    public template: TemplateRef<NormalStateTagContext<any>> = inject(TemplateRef);

    //######################### ng language server #########################

    /**
     * Allows typechecking for template
     */
    static ngTemplateContextGuard(_dir: NormalStateTagTemplate, _ctx: unknown): _ctx is NormalStateTagContext<any>
    {
        return true;
    }
}
