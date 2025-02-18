import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef} from '@angular/core';
import {isBlank} from '@jscrpt/common';
import {extend} from '@jscrpt/common/extend';

import {DynamicValueHandlerOptions, DynamicValueHandler} from './dynamicValueHandler.interface';
import {NgSelectPluginInstances} from '../../../components/select';
import {NG_SELECT_PLUGIN_INSTANCES} from '../../../components/select/types';
import {VALUE_HANDLER_OPTIONS} from '../types';
import {ɵNgSelectOption} from '../../../components/option';
import {ValueHandlerBase} from '../valueHandlerBase';
import {PluginBus} from '../../../misc/pluginBus/pluginBus';

/**
 * Default options for value handler
 * @internal
 */
const defaultOptions: DynamicValueHandlerOptions =
{
    textExtractor: value => value
};

/**
 * Component used for handling current value of NgSelect, allows values which are not present in options
 */
@Component(
{
    selector: 'ng-dynamic-value-handler',
    template: '',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicValueHandlerComponent<TValue = any> extends ValueHandlerBase<TValue, DynamicValueHandlerOptions<TValue>> implements DynamicValueHandler<TValue>
{
    //######################### public properties - implementation of DynamicValueHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): DynamicValueHandlerOptions<TValue>
    {
        return this._options;
    }
    public set options(options: DynamicValueHandlerOptions<TValue>)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                @Optional() pluginBus: PluginBus<TValue>,
                pluginElement: ElementRef,
                @Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: DynamicValueHandlerOptions<TValue>)
    {
        super(ngSelectPlugins, pluginElement, pluginBus);

        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of DynamicValueHandler #########################

    /**
     * Sets value for NgSelect
     * @param value - Value to be set
     */
    public setValue(value: TValue|TValue[]): void
    {
        this._useOptionsAsValue(value);
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public override initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public override invalidateVisuals(): void
    {
    }

    //######################### protected methods #########################

    /**
     * Sets value
     */
    protected _setValue = (option: ɵNgSelectOption<TValue>) =>
    {
        //multiple values are allowed
        if(this.pluginBus.selectOptions.multiple)
        {
            if(!Array.isArray(this.selectedOptions))
            {
                this.selectedOptions = [];
            }

            if(Array.isArray(this.selectedOptions))
            {
                //value exists, removing from list
                if(this.selectedOptions.find(selOpt => this.valueComparer(selOpt.value, option.value)))
                {
                    const index = this.selectedOptions.indexOf(option);
                    this.selectedOptions.splice(index, 1);
                }
                //adding value
                else
                {
                    this.selectedOptions.push(option);
                }

                this.selectedOptions = [...this.selectedOptions];
            }
        }
        else
        //only signle value allowed
        {
            this.selectedOptions = option;
        }

        this._clearSelected();
        this._markValueAsSelected();

        this._normalState.invalidateVisuals();
        this.valueChange.emit();
    };

    /**
     * Loads options
     */
    protected _loadOptions()
    {
    }

    /**
     * Converts value to options
     * @param value - Value to be changed to options
     */
    protected async _useOptionsAsValue(value: TValue|TValue[])
    {
        //set empty value
        if(isBlank(value) || (Array.isArray(value) && !value.length))
        {
            this.selectedOptions = value;

            this._clearSelected();
            this._normalState.invalidateVisuals();
            this.valueChange.emit();

            return;
        }

        if(this.pluginBus.selectOptions.multiple)
        {
            if(Array.isArray(value))
            {
                const items = value;
                const options: ɵNgSelectOption<TValue>[] = [];

                for(const itm of items)
                {
                    options.push(await this._loadText(itm));
                }

                this.selectedOptions = options;
            }
            else
            {
                throw new Error('Don`t you have redundant "multiple"?');
            }
        }
        else
        {
            if(Array.isArray(value))
            {
                throw new Error('Are you missing attribute "multiple"?');
            }
            else
            {
                const item = value;

                this.selectedOptions = await this._loadText(item);
            }
        }

        this._clearSelected();
        this._markValueAsSelected();
        this._normalState.invalidateVisuals();
        this.valueChange.emit();
    }

    /**
     * Loads text for specified value
     * @param value - Value that is going to be used for obtaining option
     */
    protected async _loadText(value: TValue): Promise<ɵNgSelectOption<TValue>>
    {
        //load option dynamically
        if(this.options.dynamicOptionsCallback)
        {
            const opts = await this.options.dynamicOptionsCallback(value);

            if(opts && opts.length)
            {
                const opt: ɵNgSelectOption<TValue> = opts[0];

                opt.value = value;
                opt.selected = true;

                return opt;
            }
        }

        //load option from value
        return <ɵNgSelectOption<TValue>>
        {
            selected: true,
            active: false,
            value: value,
            text: this.options.textExtractor(value)
        };
    }
}
