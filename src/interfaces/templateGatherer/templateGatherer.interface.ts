import {Signal, TemplateRef} from '@angular/core';

import {NormalStateContext} from '../normalStateContext/normalStateContext.interface';
import {PopupContext} from '../popupContext/popupContext.interface';

/**
 * Gatherer used for obtaining templates for NgSelect
 */
export interface TemplateGatherer
{
    /**
     * Template used within normal state, for rendering normal state if defined
     */
    readonly normalStateTemplate: Signal<TemplateRef<NormalStateContext>|undefined|null>;

    /**
     * Template used within Popup, for rendering option if defined
     */
    readonly optionTemplate: Signal<TemplateRef<PopupContext>|undefined|null>;
}
