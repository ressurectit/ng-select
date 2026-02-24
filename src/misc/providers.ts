import {Provider, Type, ValueProvider} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {Interactions, KeyboardHandler, LiveSearch, NormalState, OptionsHandler, Popup, Positioner, ReadonlyState, SelectOptions, ValueHandler} from '../interfaces';
import {INTERACTIONS_TYPE, KEYBOARD_HANDLER_TYPE, LIVE_SEARCH_TYPE, NORMAL_STATE_TYPE, OPTIONS_HANDLER_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, SELECT_OPTIONS, VALUE_HANDLER_TYPE} from './tokens';

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
