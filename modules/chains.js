// Import chains
import chains from '../constants/chainIds'

// Create a list of the chain names
const chain_names = Object.values( chains )
const chain_ids = Object.keys( chains )

// Create a list of the chain ids by name
export const chains_by_name = chain_names.reduce( ( acc, chain_name ) => {
    const index = chain_names.indexOf( chain_name )
    acc[chain_name] = chain_ids[index]
    return acc
}, {} )