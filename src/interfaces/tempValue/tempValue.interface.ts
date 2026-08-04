/**
 * Used for storing temporary value during async write
 */
export interface TempValue<TValue>
{
    //######################### properties #########################

    /**
     * Stored value
     */
    value?: TValue|undefined|null;
}
