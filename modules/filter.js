// Import the constants
import rpcs from '../constants/extraRpcs'
import chains from '../constants/chainIds'
import { chains_by_name } from './chains'



/**
 * Retrieves the RPC urls for a specified blockchain.
 *
 * @param {Object} params - The parameters for retrieving RPCs.
 * @param {number} [params.chain_id] - The ID of the blockchain.
 * @param {string} [params.chain_name] - The name of the blockchain.
 * @param {Array} [params.allowed_tracking=[]] - An array of tracking objects. Options: none, limited, yes.
 * @returns {Array} The list of RPCs for the specified blockchain.
 * @throws {Error} If both chain_id and chain_name are specified but do not match.
 */
export function get_rpcs_for_chain( { chain_id, chain_name, allowed_tracking=[] } ) {

    // If chain_id and chain_name were both specified do a sanify check
    if( chain_id && chain_name ) {
        if( chains[chain_id] !== chain_name ) {
            throw new Error( `Chain ID ${ chain_id } does not match chain name ${ chain_name }` )
        }
    }

    // If chain name was specified, and chain_id was not, get chain_id from chain name
    if( chain_name && !chain_id ) {
        chain_id = chains_by_name[chain_name]
    }

    // Get the rpcs for this chain id
    let { rpcs: chain_rpcs } = rpcs[chain_id]

    // Filter out the rpcs based on the tracking
    if( allowed_tracking.length ) chain_rpcs = chain_rpcs.filter( ( { tracking } ) => allowed_tracking.includes( tracking ) )

    // Return the rpcs
    return chain_rpcs

}

/**
 * Retrieves the RPC urls for the specified chains.
 *
 * @param {Object} params - The parameters object.
 * @param {Array<string>} [params.chain_ids=[]] - An array of chain IDs.
 * @param {Array<string>} [params.chain_names=[]] - An array of chain names.
 * @param {Array} [params.allowed_tracking=[]] - An array of tracking objects. Options: none, limited, yes.
 * @returns {Array} An array of RPCs for the specified chains.
 */
export function get_rcpcs_for_chains( { chain_ids=[], chain_names=[], allowed_tracking=[] } ) {

    // If chain names were specified, get the chain ids
    chain_ids = [
        ...chain_ids,
        ...chain_names.map( chain_name => chains_by_name[chain_name] )
    ]

    // If chain ids were specified, get the chain names
    chain_names = [
        ...chain_names,
        ...chain_ids.map( chain_id => chains[chain_id] )
    ]

    // Dedupe the chain arrays
    chain_ids = [ ...new Set( chain_ids ) ]
    chain_names = [ ...new Set( chain_names ) ]

    // Remove undefined entries
    chain_ids = chain_ids.filter( chain_id => chain_id )
    chain_names = chain_names.filter( chain_name => chain_name )

    // Get the rpcs for each chain id
    const rpcs_by_id = chain_ids.reduce( ( acc, chain_id ) => {
        acc[chain_id] = get_rpcs_for_chain( { chain_id, allowed_tracking } )
        return acc
    }, {} )
    const rpcs_by_name = chain_names.reduce( ( acc, chain_name ) => {
        acc[chain_name] = get_rpcs_for_chain( { chain_name, allowed_tracking } )
        return acc
    }, {} )

    // Return the rpcs
    return { ...rpcs_by_id, ...rpcs_by_name }

}