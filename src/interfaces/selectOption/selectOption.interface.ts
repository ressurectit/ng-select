/**
 * Option for select
 */
export interface SelectOption<TValue = unknown|undefined|null>
{
    /**
     * Value that will be used if this option will be selected
     */
    value: TValue|undefined|null;

    /**
     * Text that is displayed if this value is selected
     */
    text: string;

    /**
     * If specified this option will be displayed in group
     */
    group?: string|null;
}
