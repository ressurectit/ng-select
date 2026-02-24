import {AsSignal} from '@anglr/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';

function optionsTransform(currentOptions: unknown, options: unknown): unknown
{
    return deepCopyWithArrayOverride({}, currentOptions, options);
}

/**
 * Creates backing field for this property as WritableSignal, reads and write to it, and merges options
 */
export function CopyOptionsAsSignal(): PropertyDecorator
{
    return AsSignal(optionsTransform);
}
