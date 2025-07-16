import {InjectionToken} from '@angular/core';
import {RecursivePartial} from '@jscrpt/common';

import {SelectOptions} from '../interfaces/selectOptions/selectOptions.interface';

/**
 * Injection token for 'SelectOptions'
 */
export const SELECT_OPTIONS: InjectionToken<RecursivePartial<SelectOptions>> = new InjectionToken<RecursivePartial<SelectOptions>>('SELECT_OPTIONS');

// /**
//  * Injection token for 'KeyboardHandler' implementation
//  */
// export const KEYBOARD_HANDLER_TYPE: InjectionToken<Type<KeyboardHandler>> = new InjectionToken<Type<KeyboardHandler>>('KEYBOARD_HANDLER_TYPE');

// /**
//  * Injection token for 'NormalState' implementation
//  */
// export const NORMAL_STATE_TYPE: InjectionToken<Type<NormalState>> = new InjectionToken<Type<NormalState>>('NORMAL_STATE_TYPE');

// /**
//  * Injection token for 'Popup' implementation
//  */
// export const POPUP_TYPE: InjectionToken<Type<Popup>> = new InjectionToken<Type<Popup>>('POPUP_TYPE');

// /**
//  * Injection token for 'Positioner' implementation
//  */
// export const POSITIONER_TYPE: InjectionToken<Type<Positioner>> = new InjectionToken<Type<Positioner>>('POSITIONER_TYPE');

// /**
//  * Injection token for 'ReadonlyState' implementation
//  */
// export const READONLY_STATE_TYPE: InjectionToken<Type<ReadonlyState>> = new InjectionToken<Type<ReadonlyState>>('READONLY_STATE_TYPE');

// /**
//  * Injection token for 'ValueHandler' implementation
//  */
// export const VALUE_HANDLER_TYPE: InjectionToken<Type<ValueHandler>> = new InjectionToken<Type<ValueHandler>>('VALUE_HANDLER_TYPE');

// /**
//  * Injection token for 'LiveSearch' implementation
//  */
// export const LIVE_SEARCH_TYPE: InjectionToken<Type<LiveSearch>> = new InjectionToken<Type<LiveSearch>>('LIVE_SEARCH_TYPE');
