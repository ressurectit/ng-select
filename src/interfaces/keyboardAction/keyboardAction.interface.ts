/**
 * Defines keyboard action that is used as data when keyboard event occurs
 */
export interface KeyboardAction<TType extends string>
{
    //######################### properties #########################

    /**
     * Type of keyboard action
     */
    type: TType;
}

/**
 * Defines keyboard action that should mark option as active
 */
export interface MarkActiveKeyboardAction extends KeyboardAction<'MARK_ACTIVE'>
{
    //######################### properties #########################

    /**
     * Index of option to be marked as active
     */
    index: number|undefined|null;
}

/**
 * Defines keyboard action that should select active option
 */
export interface SelectActiveKeyboardAction extends KeyboardAction<'SELECT_ACTIVE'>
{
}

/**
 * Defines keyboard action that should hide popup
 */
export interface HidePopupKeyboardAction extends KeyboardAction<'HIDE_POPUP'>
{
}

/**
 * Defines keyboard action that should show popup
 */
export interface ShowPopupKeyboardAction extends KeyboardAction<'SHOW_POPUP'>
{
}
