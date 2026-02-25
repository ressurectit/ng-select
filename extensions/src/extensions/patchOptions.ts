// import {SelectAction, SelectOptions} from '@anglr/select';

// /**
//  * Method used to patch options without full initialization of NgSelect, only options are initialized
//  * @param options - Options to be used as patch
//  */
// export function patchOptions<TValue = any>(options: SelectOptions<TValue>): SelectAction<TValue>
// {
//     return ngSelect =>
//     {
//         ngSelect.selectOptions = options;

//         ngSelect.initOptions();
//         ngSelect.invalidateVisuals();
//     };
// }