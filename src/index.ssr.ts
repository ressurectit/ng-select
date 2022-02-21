/**
 * Allows Server Side Rendering for @anglr/select to work, call it as soon as possible
 */
(function(global: any) 
{
    if(!global.Document)
    {
        global.Document = function(){};
    }
})(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global);