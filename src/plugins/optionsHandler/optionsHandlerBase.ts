import {Directive, effect, ElementRef, inject, signal, WritableSignal} from '@angular/core';

import {OptionsHandlerOptions, SelectOptionStateSyntetic} from '../../interfaces';
import {SelectBus, SelectPluginInstances} from '../../misc/classes';

/**
 * Base class for options handlers.
 */
@Directive()
export abstract class OptionsHandlerBase<TValue = unknown, TOptions extends OptionsHandlerOptions<TValue> = OptionsHandlerOptions<TValue>>
{
    //######################### protected fields #########################

    /**
     * First option to be inserted into options list, when adding new option is enabled
     */
    protected firstOption: WritableSignal<SelectOptionStateSyntetic<TValue>|undefined|null> = signal(null);

    //######################### public properties - implementation of SelectPlugin #########################

    /**
     * @inheritdoc
     */
    public abstract options: TOptions;

    /**
     * @inheritdoc
     */
    public selectPlugins: SelectPluginInstances<TValue> = inject(SelectPluginInstances);

    /**
     * @inheritdoc
     */
    public pluginElement: ElementRef<HTMLElement> = inject(ElementRef);

    /**
     * @inheritdoc
     */
    public selectBus: SelectBus<TValue> = inject(SelectBus);

    //######################### constructor #########################
    constructor()
    {
        effect(() =>
        {
            const newOptionsGetter = this.options.newOptionGetter;

            if(!newOptionsGetter)
            {
                this.firstOption.set(null);

                return;
            }

            const search = this.selectPlugins.LiveSearch.search();

            if(!search)
            {
                this.firstOption.set(null);

                return;
            }

            const newOption = newOptionsGetter(search) as SelectOptionStateSyntetic<TValue>;
            newOption.created = true;
            newOption.selected = signal(false);
            newOption.active = signal(false);

            this.firstOption.set(newOption);
        });
    }
}
