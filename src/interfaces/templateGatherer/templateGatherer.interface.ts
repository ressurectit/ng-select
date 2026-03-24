import {Signal, TemplateRef} from '@angular/core';

import {NormalStateContext} from '../normalStateContext/normalStateContext.interface';
import {PopupContext} from '../popupContext/popupContext.interface';
import {NormalStateTagContext} from '../normalStateTagContext/normalStateTagContext.interface';

/**
 * Gatherer used for obtaining templates for Select
 */
export interface TemplateGatherer<TValue = unknown>
{
    /**
     * Template used within normal state, for rendering normal state if defined
     */
    readonly normalStateTemplate: Signal<TemplateRef<NormalStateContext<TValue>>|undefined|null>;

    /**
     * Template used within Popup, for rendering option if defined
     */
    readonly optionTemplate: Signal<TemplateRef<PopupContext<TValue>>|undefined|null>;

    /**
     * Template used within normal state, for rendering tags
     */
    readonly normalStateTagTemplate: Signal<TemplateRef<NormalStateTagContext<TValue>>|undefined|null>;
}
