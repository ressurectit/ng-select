import {Directive, effect, model, ModelSignal, untracked} from '@angular/core';
import {nameof} from '@jscrpt/common';
import {isEqual} from 'lodash-es';

import {SelectPluginType} from '../../misc/enums';
import {Select} from '../../components/select/select.component';
import {TempValue} from '../../interfaces';

/**
 * Directive that allows direct access to select properties using inputs, outputs
 */
@Directive(
{
    selector: 'ng-select[withDirectAccess]',
})
export class WithDirectAccess<TValue = unknown, TPublicValue = TValue>
{
    //######################### protected fields #########################

    /**
     * Temporary value used for storing value during async write
     */
    protected tmpValue: TempValue<TPublicValue|TPublicValue[]> = {};

    //######################### public properties - inputs/outputs #########################

    /**
     * Value of the Select to be set
     */
    public value: ModelSignal<TPublicValue|TPublicValue[]|undefined|null> = model<TPublicValue|TPublicValue[]|undefined|null>(undefined);

    //######################### constructor #########################
    constructor(select: Select<TValue, TPublicValue>,)
    {
        //setting value
        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            const value = this.value();

            untracked(async () =>
            {
                if(!isEqual(select.getPlugin(SelectPluginType.ValueHandler).value(), value))
                {
                    this.tmpValue.value = value;
                    await select.getPlugin(SelectPluginType.ValueHandler).setValue(value);
                    delete this.tmpValue.value;
                }
            });
        });

        //getting value
        effect(() =>
        {
            if(!select.initialized())
            {
                return;
            }

            let value = select.getPlugin(SelectPluginType.ValueHandler).value();

            if(nameof<TempValue<TPublicValue|TPublicValue[]>>('value') in this.tmpValue)
            {
                value = this.tmpValue.value;
            }

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
