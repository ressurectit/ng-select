/**
 * Defines keyboard action that is used as data when keyboard event occurs
 */
export interface KeyboardAction<TType>
{
    //######################### properties #########################

    /**
     * Type of keyboard action
     */
    type: TType;
}

/**
 * Defines keyboard action that should select active option
 */
export interface SelectActiveKeyboardAction extends KeyboardAction<'SELECT_ACTIVE'>
{
}

/**
 * Defines keyboard action that should select first that corresponds to entered letters
 */
export interface SelectFirstKeyboardAction extends KeyboardAction<'SELECT_FIRST'>
{
    //######################### properties #########################

    /**
     * Text that should be used for finding option to select
     */
    search: string;
}

/**
 * Defines keyboard action that should remove last selected value or only value if select is single
 */
export interface RemoveLastSelectedValueKeyboardAction extends KeyboardAction<'REMOVE_LAST_SELECTED_VALUE'>
{
}
