import {untracked} from '@angular/core';
import {isDescendant, NoopAction} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {SelectOption} from '../interfaces';
import {SelectBus, SelectPluginInstances} from './classes';

/**
 * Compares value and select option
 * @param value - Value to be compared
 * @param option - Option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareValueAndOption<TValue>(value: TValue, option: SelectOption<TValue>, selectBus: SelectBus<TValue>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(value, selectBus.selectOptions().valueExtractor(option)));
}

/**
 * Compares two select options
 * @param source - Source option to be compared
 * @param target - Target option to be compared with
 * @param selectBus - Instance of select bus use for obtaining value comparerer and value extractor functions
 */
export function compareSelectOptions<TValue>(source: SelectOption<TValue>, target: SelectOption<TValue>, selectBus: SelectBus<TValue>): boolean
{
    return untracked(() => selectBus.selectOptions().valueComparer(selectBus.selectOptions().valueExtractor(source), selectBus.selectOptions().valueExtractor(target)));
}

/**
 * Toggles popup on click on select
 * @param selectBus - Instance of select bus
 * @param subscriptions - Subscriptions to used
 */
export function togglePopupOnClick<TValue>(selectBus: SelectBus<TValue>, subscriptions: Subscription): void
{
    subscriptions.add(selectBus.click.subscribe(() => selectBus.popupVisible.update(val => !val)));
}

/**
 * Handles option click, handles selection of options
 * @param selectBus  - Instance of select bus
 * @param selectPlugins - Instance with select plugins
 * @param subscriptions - Subscriptions to used
 */
export function handleOptionClick<TValue>(selectBus: SelectBus<TValue>, selectPlugins: SelectPluginInstances, subscriptions: Subscription): void
{
    subscriptions.add(selectBus.optionClick.subscribe(event =>
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
            if(selected !== event.data)
            {
                selected?.selected.set(false);
                event.data?.selected.set(true);

                selectBus.selectedOptions.set(event.data);
            }

            selectBus.popupVisible.set(false);
        }
    }));
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
export function handleClickOutside<TValue>(document: Document, selectBus: SelectBus<TValue>, selectPlugins: SelectPluginInstances): NoopAction
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
