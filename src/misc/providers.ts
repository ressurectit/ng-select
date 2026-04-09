import {Provider, Type, ValueProvider} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {Interactions, InteractionsOptions, KeyboardHandler, KeyboardHandlerOptions, LiveSearch, LiveSearchOptions, NormalState, NormalStateOptions, OptionsHandler, OptionsHandlerOptions, Popup, PopupOptions, Positioner, PositionerOptions, ReadonlyState, ReadonlyStateOptions, SelectOptions, ValueHandler, ValueHandlerOptions} from '../interfaces';
import {INTERACTIONS_OPTIONS, INTERACTIONS_TYPE, KEYBOARD_HANDLER_OPTIONS, KEYBOARD_HANDLER_TYPE, LIVE_SEARCH_OPTIONS, LIVE_SEARCH_TYPE, NORMAL_STATE_OPTIONS, NORMAL_STATE_TYPE, OPTIONS_HANDLER_OPTIONS, OPTIONS_HANDLER_TYPE, POPUP_OPTIONS, POPUP_TYPE, POSITIONER_OPTIONS, POSITIONER_TYPE, READONLY_STATE_OPTIONS, READONLY_STATE_TYPE, SELECT_OPTIONS, VALUE_HANDLER_OPTIONS, VALUE_HANDLER_TYPE} from './tokens';

/**
 * Provides options for select globally
 * @param options - Options to be provided
 */
export function provideSelectOptions(options: RecursivePartial<SelectOptions>): Provider
{
    return <ValueProvider>{
        provide: SELECT_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides type of keyboard handler that will be used for select globally
 * @param type - Type to be used as keyboard handler
 */
export function provideKeyboardHandlerType(type: Type<KeyboardHandler>): Provider
{
    return <ValueProvider>{
        provide: KEYBOARD_HANDLER_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of normal state that will be used for select globally
 * @param type - Type to be used as normal state
 */
export function provideNormalStateType(type: Type<NormalState>): Provider
{
    return <ValueProvider>{
        provide: NORMAL_STATE_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of popup that will be used for select globally
 * @param type - Type to be used as popup
 */
export function providePopupType(type: Type<Popup>): Provider
{
    return <ValueProvider>{
        provide: POPUP_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of positioner that will be used for select globally
 * @param type - Type to be used as positioner
 */
export function providePositionerType(type: Type<Positioner>): Provider
{
    return <ValueProvider>{
        provide: POSITIONER_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of readonly state that will be used for select globally
 * @param type - Type to be used as readonly state
 */
export function provideReadonlyStateType(type: Type<ReadonlyState>): Provider
{
    return <ValueProvider>{
        provide: READONLY_STATE_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of value handler that will be used for select globally
 * @param type - Type to be used as value handler
 */
export function provideValueHandlerType(type: Type<ValueHandler>): Provider
{
    return <ValueProvider>{
        provide: VALUE_HANDLER_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of live search that will be used for select globally
 * @param type - Type to be used as live search
 */
export function provideLiveSearchType(type: Type<LiveSearch>): Provider
{
    return <ValueProvider>{
        provide: LIVE_SEARCH_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of interactions that will be used for select globally
 * @param type - Type to be used as interactions
 */
export function provideInteractionsType(type: Type<Interactions>): Provider
{
    return <ValueProvider>{
        provide: INTERACTIONS_TYPE,
        useValue: type,
    };
}

/**
 * Provides type of options handler that will be used for select globally
 * @param type - Type to be used as options handler
 */
export function provideOptionsHandlerType(type: Type<OptionsHandler>): Provider
{
    return <ValueProvider>{
        provide: OPTIONS_HANDLER_TYPE,
        useValue: type,
    };
}

/**
 * Provides options for keyboard handler that will be used for select globally
 * @param options - Options to be used for keyboard handler
 */
export function provideKeyboardHandlerOptions<TOptions extends KeyboardHandlerOptions = KeyboardHandlerOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: KEYBOARD_HANDLER_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for normal state that will be used for select globally
 * @param options - Options to be used for normal state
 */
export function provideNormalStateOptions<TOptions extends NormalStateOptions = NormalStateOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: NORMAL_STATE_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for popup that will be used for select globally
 * @param options - Options to be used for popup
 */
export function providePopupOptions<TOptions extends PopupOptions = PopupOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: POPUP_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for positioner that will be used for select globally
 * @param options - Options to be used for positioner
 */
export function providePositionerOptions<TOptions extends PositionerOptions = PositionerOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: POSITIONER_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for readonly state that will be used for select globally
 * @param options - Options to be used for readonly state
 */
export function provideReadonlyStateOptions<TOptions extends ReadonlyStateOptions = ReadonlyStateOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: READONLY_STATE_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for value handler that will be used for select globally
 * @param options - Options to be used for value handler
 */
export function provideValueHandlerOptions<TOptions extends ValueHandlerOptions = ValueHandlerOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: VALUE_HANDLER_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for live search that will be used for select globally
 * @param options - Options to be used for live search
 */
export function provideLiveSearchOptions<TOptions extends LiveSearchOptions = LiveSearchOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: LIVE_SEARCH_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for interactions that will be used for select globally
 * @param options - Options to be used for interactions
 */
export function provideInteractionsOptions<TOptions extends InteractionsOptions = InteractionsOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: INTERACTIONS_OPTIONS,
        useValue: options,
    };
}

/**
 * Provides options for options handler that will be used for select globally
 * @param options - Options to be used for options handler
 */
export function provideOptionsHandlerOptions<TOptions extends OptionsHandlerOptions = OptionsHandlerOptions>(options: RecursivePartial<TOptions>): Provider
{
    return <ValueProvider>{
        provide: OPTIONS_HANDLER_OPTIONS,
        useValue: options,
    };
}
