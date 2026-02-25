import {Directive, inject, TemplateRef} from '@angular/core';

import {NormalStateContext} from '../../interfaces';

/**
 * Directive used for obtaining template for normal state
 */
@Directive(
{
    selector: '[normalStateTemplate]',
})
export class NormalStateTemplate
{
    //######################### public properties #########################

    /**
     * Instance of template for normal state
     */
    public template: TemplateRef<NormalStateContext> = inject(TemplateRef);

    //######################### ng language server #########################

    /**
     * Allows typechecking for template
     */
    static ngTemplateContextGuard(_dir: NormalStateTemplate, _ctx: unknown): _ctx is NormalStateContext
    {
        return true;
    }
}
