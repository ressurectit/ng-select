import {Component, ChangeDetectionStrategy, input, InputSignal, TemplateRef, contentChild, Signal} from '@angular/core';
import {generateId} from '@jscrpt/common';

import {SelectOptionGroup} from '../../interfaces';
import {OptionGroupTemplate} from '../../directives';

/**
 * Component used for option group in select component
 */
@Component(
{
    selector: 'ng-option-group',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionGroup implements SelectOptionGroup
{
    //######################### public properties - implementation of SelectOptionGroup #########################

    /**
     * @inheritdoc
     */
    public template: Signal<TemplateRef<{$implicit: string}>|undefined|null> = contentChild(OptionGroupTemplate, {read: TemplateRef});

    /**
     * @inheritdoc
     */
    public readonly id: string = generateId(10);

    /**
     * @inheritdoc
     */
    public text: InputSignal<string> = input.required();
}
