import {untracked} from '@angular/core';
import {isDescendant, NoopAction} from '@jscrpt/common';

import {SelectOption, SelectOptionState} from '../interfaces';
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
export function compareSelectOptions<TValue, TAction>(source: SelectOption<TValue>, target: SelectOption<TValue>, selectBus: SelectBus<TValue, TAction>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(selectBus.selectOptions().valueExtractor(source), selectBus.selectOptions().valueExtractor(target)));
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
 * @param selectPlugins - Instance with select plugins
 * @param option - Option that was 'clicked'
 */
export function selectOption<TValue, TAction>(selectBus: SelectBus<TValue, TAction>, selectPlugins: SelectPluginInstances, option: SelectOptionState<TValue>|undefined|null): void
{
        //handle multiselect
    if(selectBus.selectOptions().multiple)
    {
    }
    //handle single select
    else
    {
        const selected = (selectPlugins.OptionsHandler.availableOptions() ?? []).find(itm => itm.selected());

        //select new option
        if(selected !== option)
        {
            selected?.selected.set(false);
            option?.selected.set(true);

            selectBus.selectedOptions.set(option);
        }

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
export function handleClickOutside<TValue, TAction>(document: Document, selectBus: SelectBus<TValue, TAction>, selectPlugins: SelectPluginInstances): NoopAction
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
