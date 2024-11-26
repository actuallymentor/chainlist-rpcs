import rpcs from '../constants/extraRpcs'

// The llama format is { [Number]: { rpcs: [] } }, we can simplify that
const simple_rpc_list = Object.keys( rpcs ).reduce( ( acc, chainId ) => {
    acc[chainId] = rpcs[chainId].rpcs || []
    return acc
},{} )

// The llama format for an RPC is sometimes and object and sometimes a string, let's normalize that
Object.keys( simple_rpc_list ).forEach( chainId => {
    simple_rpc_list[chainId] = simple_rpc_list[chainId].map( rpc => {
        if( typeof rpc === 'string' ) {
            return { url: rpc, tracking: 'unknown', trackingDetails: 'unknown' }
        }
        return rpc
    } )
} )

export default simple_rpc_list