import {Directive, effect, model, ModelSignal, untracked} from '@angular/core';
import {isEqual} from 'lodash-es';

import {SelectPluginType} from '../../misc/enums';
import {Select} from '../../components/select/select.component';

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

            untracked(() =>
            {
                if(!isEqual(select.getPlugin(SelectPluginType.ValueHandler).value(), value))
                {
                    select.getPlugin(SelectPluginType.ValueHandler).setValue(value);
                }
            });
        });

        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            const value = select.getPlugin(SelectPluginType.ValueHandler).value();

            untracked(() =>
            {
                if(!isEqual(this.value(), value))
                {
                    this.value.set(value);
                }
            });
        });
    }
}
