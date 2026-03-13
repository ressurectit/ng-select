import {Directive, effect, model, ModelSignal} from '@angular/core';

import {Select} from '../../components';
import {SelectPluginType} from '../../misc/enums';

//TODO: finish

/**
 * Directive that allows direct access to select properties using inputs, outputs
 */
@Directive(
{
    selector: 'ng-select[withDirectAccess]',
})
export class WithDirectAccess<TValue = unknown>
{
    //######################### public properties - inputs/outputs #########################

    /**
     * Value of the Select to be set
     */
    public value: ModelSignal<TValue|TValue[]|undefined|null> = model<TValue|TValue[]|undefined|null>(undefined);

    //######################### constructor #########################
    constructor(select: Select<TValue>,)
    {
        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            const value = this.value();

            if(value === undefined)
            {
                return;
            }

            select.getPlugin(SelectPluginType.ValueHandler).setValue(value);
        });

        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            const value = select.getPlugin(SelectPluginType.ValueHandler).value();

            if(value === undefined)
            {
                return;
            }

            this.value.set(value);
        });
    }
}
