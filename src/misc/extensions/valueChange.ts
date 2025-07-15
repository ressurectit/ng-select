// import {Subscription} from 'rxjs';

// import {NgSelectFunction} from '../../components/select';
// import {ValueHandler} from '../../plugins/valueHandler';
// import {VALUE_HANDLER} from '../../plugins/valueHandler/types';

// /**
//  * Adds callback that is called when value changes and returns subscription for this changes
//  * @internal
//  */
// export function ɵValueChange<TValue>(callback: (value: TValue|TValue[]) => void): NgSelectFunction<Subscription, TValue>
// {
//     return ngSelect =>
//     {
//         const valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

//         return valueHandler.valueChange.subscribe(() => callback(valueHandler.value));
//     };
// }