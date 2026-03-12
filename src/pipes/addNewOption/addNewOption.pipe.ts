import {inject, Pipe, PipeTransform} from '@angular/core';

import {SelectOptionStateSyntetic} from '../../interfaces';
import {SelectPluginInstances} from '../../misc/classes';

/**
 * For syntetic option displays text that new option is being added
 */
@Pipe({name: 'addNewOption'})
export class AddNewOption implements PipeTransform
{
    //######################### protected fields #########################

    /**
     * Instance of select bus
     */
    protected pluginInstances: SelectPluginInstances = inject(SelectPluginInstances);

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * For syntetic option displays text that new option is being added
     * @param value - Option
     */
    public transform<TValue>(value: SelectOptionStateSyntetic<TValue>|undefined|null): string
    {
        if(!value)
        {
            return '';
        }

        if(!value.created)
        {
            return '';
        }

        return `${this.pluginInstances.Popup.options.texts.addNewOption} `;
    }
}
