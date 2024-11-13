/**
 * Deeply merges two objects. If properties in the source object are arrays, 
 * they will be concatenated with the target object's arrays. If properties 
 * are objects, they will be recursively merged.
 *
 * @param {Object} target - The target object to merge into.
 * @param {Object} source - The source object to merge from.
 * @returns {Object} - The new object resulting from the deep merge.
 * @note This was based on https://github.com/DefiLlama/chainlist/blob/main/utils/fetch.js and put in this file since the imported files in ../constants expect it here
 */
export function mergeDeep( target, source ) {
    const newTarget = { ...target }
    const isObject = ( obj ) => obj && typeof obj === 'object'

    if( !isObject( newTarget ) || !isObject( source ) ) {
        return source
    }

    Object.keys( source ).forEach( key => {
        const targetValue = newTarget[key]
        const sourceValue = source[key]

        if( Array.isArray( targetValue ) && Array.isArray( sourceValue ) ) {
            newTarget[key] = targetValue.concat( sourceValue )
        } else if( isObject( targetValue ) && isObject( sourceValue ) ) {
            newTarget[key] = mergeDeep( Object.assign( {}, targetValue ), sourceValue )
        } else {
            newTarget[key] = sourceValue
        }
    } )

    return newTarget
}