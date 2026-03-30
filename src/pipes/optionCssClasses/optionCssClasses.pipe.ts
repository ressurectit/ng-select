import {Pipe, PipeTransform} from '@angular/core';

import {SelectOptionGroup, SelectOptionState, SimplePopupCssClasses} from '../../interfaces';

/**
 * Obtains css classes for popup option
 */
@Pipe({name: 'optionCssClasses', pure: false})
export class OptionCssClasses implements PipeTransform
{
    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Obtains css classes for popup option
     * @param value - Instance of option
     * @param cssClasses - Css classes for simple popup
     * @param group - Option group name
     */
    public transform<TValue>(value: SelectOptionState<TValue>, cssClasses: SimplePopupCssClasses, group: SelectOptionGroup|null): string[]
    {
        return [cssClasses.option,
            ...value.selected() ? [cssClasses.selected] : [],
            ...value.active() ? [cssClasses.active] : [],
            ...group ? [cssClasses.inGroup] : [],
        ];
    }
}
