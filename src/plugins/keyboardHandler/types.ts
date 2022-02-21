import {InjectionToken} from '@angular/core';

import {KeyboardHandlerOptions} from './keyboardHandler.interface';

/**
 * Constant used for accessing keyboard handler plugin in NgSelect
 */
export const KEYBOARD_HANDLER = 'KEYBOARD_HANDLER';

/**
 * Token for injecting options for keyboard handler plugin
 */
export const KEYBOARD_HANDLER_OPTIONS: InjectionToken<KeyboardHandlerOptions> = new InjectionToken<KeyboardHandlerOptions>('KEYBOARD_HANDLER_OPTIONS');