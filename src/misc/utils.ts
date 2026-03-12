import {untracked} from '@angular/core';
import {isBlank, isDescendant, NoopAction} from '@jscrpt/common';

import {SelectOption, SelectOptionState, ValueHandler, ValueHandlerOptions} from '../interfaces';
import {SelectBus, SelectPluginInstances} from './classes';

/**
 * Compares value and select option
 * @param value - Value to be compared
 * @param option - Option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareValueAndOption<TValue, TAction>(value: TValue, option: SelectOption<TValue>, selectBus: SelectBus<TValue, TAction>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(value, selectBus.selectOptions().valueExtractor(option)));
}

/**
 * Compares two select options
 * @param source - Source option to be compared
 * @param target - Target option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareSelectOptions<TValue, TAction>(source: SelectOption<TValue>|undefined|null, target: SelectOption<TValue>|undefined|null, selectBus: SelectBus<TValue, TAction>): boolean
{
    return untracked(() => source === target || ((!!source && !!target) ? selectBus.selectOptions().valueComparer(selectBus.selectOptions().valueExtractor(source), selectBus.selectOptions().valueExtractor(target)) : false));
}

/**
 * Toggles popup visiblity
 * @param selectBus - Instance of select bus
 */
export function togglePopup<TValue, TAction>(selectBus: SelectBus<TValue, TAction>): void
{
    selectBus.popupVisible.update(val => !val);
}

/**
 * Handles selection of options
 * @param selectBus  - Instance of select bus
 * @param option - Option that was 'clicked'
 */
export function selectOption<TValue, TAction>(selectBus: SelectBus<TValue, TAction>, option: SelectOptionState<TValue>|undefined|null): void
{
    //handle multiselect
    if(selectBus.selectOptions().multiple)
    {
        option?.selected.update(val => !val);
        let selectedOptions = selectBus.selectedOptions();

        if(!Array.isArray(selectedOptions))
        {
            selectedOptions = [];
        }

        const selected = selectedOptions.filter(itm => itm.selected());

        if(option?.selected())
        {
            selected.push(option);
        }

        selectBus.selectedOptions.set(selected);
    }
    //handle single select
    else
    {
        const selectedOption = selectBus.selectedOptions();

        if(Array.isArray(selectedOption))
        {
            throw new Error('Unexpected array of values! Remove multiple attribute!');
        }

        //select new option
        if(!compareSelectOptions(selectedOption, option, selectBus))
        {
            selectedOption?.selected.set(false);
            option?.selected.set(true);

            selectBus.selectedOptions.set(option);
        }
    }

    if(selectBus.selectOptions().closeOnSelect)
    {
        selectBus.popupVisible.set(false);
    }
}

/**
 * Handles click outside of select for closing popover
 *
 * Returns function that unregisters callback
 *
 * @param document - HTML document instance
 * @param selectBus  - Instance of select bus
 * @param selectPlugins - Instance with select plugins
 */
export function handleClickOutside<TValue, TAction>(document: Document, selectBus: SelectBus<TValue, TAction>, selectPlugins: SelectPluginInstances<TValue>): NoopAction
{
    const handleClick = (event: MouseEvent) =>
    {
        if(selectBus.selectElement().nativeElement != event.target &&
           !isDescendant(selectBus.selectElement().nativeElement, event.target as HTMLElement) &&
           (!selectPlugins.Popup.pluginElement.nativeElement || (selectPlugins.Popup.pluginElement.nativeElement != event.target &&
                                                                 !isDescendant(selectPlugins.Popup.pluginElement.nativeElement, event.target as HTMLElement))))
        {
            selectBus.popupVisible.set(false);
        }
    };

    document.addEventListener('mouseup', handleClick);

    return () => document.removeEventListener('mouseup', handleClick);
}

/**
 * Function for computed value signal
 * @param this - Instance of bound `ValueHandler`
 */
export function computedValue<TValue>(this: ValueHandler<TValue, ValueHandlerOptions>): TValue|TValue[]|undefined|null
{
    const selected = this.selectBus.selectedOptions();
    const valueExtractor = this.selectBus.selectOptions().valueExtractor;

    if(isBlank(selected))
    {
        return selected;
    }

    if(Array.isArray(selected))
    {
        return selected.map(option => valueExtractor(option));
    }

    return valueExtractor(selected);
}
