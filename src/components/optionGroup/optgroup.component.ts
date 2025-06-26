import {Component, ChangeDetectionStrategy, input, InputSignal, TemplateRef} from '@angular/core';
import {generateId} from '@jscrpt/common';

import {SelectOptionGroup} from '../../interfaces';

/**
 * Component used for option group in select component
 */
@Component(
{
    selector: 'ng-option-group',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptGroupComponent implements SelectOptionGroup
{
    //######################### public properties - implementation of SelectOptionGroup #########################

    /**
     * @inheritdoc
     */
    public template: TemplateRef<{$implicit: string}>|undefined|null;

    /**
     * @inheritdoc
     */
    public id: string = generateId(10);

    /**
     * @inheritdoc
     */
    public text: InputSignal<string> = input.required();
}
