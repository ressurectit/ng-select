/**
 * Gatherer used for obtaining options for select
 */
export interface OptionsGatherer<TValue = unknown>
{
    /**
     * Array of all available options for select
     */
    readonly availableOptions: NgSelectOption<TValue>[];
}
