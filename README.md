# Unofficial chainlist RPC npm module

Installation: `npm install -S chainlist-rpcs`

NOTE: This module is unofficial and not maintained by Chainlist. If you want to add RPC urls, please refer to the [DefiLlama/chainlist](https://github.com/DefiLlama/chainlist) repository.

NOTE 2: Keep in mind these RPCs are public and may have rate limits and imperfedt uptimel Use them at your own risk.

## Usage of constants

The module exports constants that are objects you can access. The `rpcs` and `chains_by_id` constants which equal the chainlist sources [in this folder of their repository](https://github.com/DefiLlama/chainlist/tree/main/constants). The `chains_by_name` constant is an object that maps chain names to their id.

```js
import { rpcs, chains_by_id, chains_by_name } from 'chainlist-rpcs'

console.log( chains[1] ) // Output: "ethereum"
console.log( rpcs[1] ) // { rpcs: [ { url: String, tracking: String, trackingDetauls: String } ] }
console.log( chains_by_name["ethereum"] ) // Output: 1
```

## Usage of helper functions

This module makes available helpers that allow you to grab RPCs based on chain id or chain name.

```js
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
export function get_rpcs_for_chain( { chain_id, chain_name, allowed_tracking=[] } )

/**
 * Retrieves the RPC urls for the specified chains.
 *
 * @param {Object} params - The parameters object.
 * @param {Array<string>} [params.chain_ids=[]] - An array of chain IDs.
 * @param {Array<string>} [params.chain_names=[]] - An array of chain names.
 * @param {Array} [params.allowed_tracking=[]] - An array of tracking objects. Options: none, limited, yes.
 * @returns {Array} An array of RPCs for the specified chains.
 */
export function get_rcpcs_for_chains( { chain_ids=[], chain_names=[], allowed_tracking=[] } )

```

Example usage:

```js
import { get_rcpcs_for_chain, get_rcpcs_for_chains } from 'chainlist-rpcs'

const single_chain_by_id = get_rcpcs_for_chain( { chain_id: 1 } ) // Output: [ { url: String, tracking: String, trackingDetauls: String } ]
const single_chain_by_name = get_rcpcs_for_chain( { chain_name: "ethereum" } ) // Output: [ { url: String, tracking: String, trackingDetauls: String } ]

const multiple_chains_by_id = get_rcpcs_for_chains( { chain_ids: [1, 42161] } ) // Output: { 1: [ { url: String, tracking: String, trackingDetauls: String } ], 42161: [ { url: String, tracking: String, trackingDetauls: String } ], ethereum: [ { url: String, tracking: String, trackingDetauls: String } ], arbitrum: [ { url: String, tracking: String, trackingDetauls: String } ] }

const multiple_chains_by_name = get_rcpcs_for_chains( { chain_names: ["ethereum", "arbitrum"] } ) // Output: { 1: [ { url: String, tracking: String, trackingDetauls: String } ], 42161: [ { url: String, tracking: String, trackingDetauls: String } ], ethereum: [ { url: String, tracking: String, trackingDetauls: String } ], arbitrum: [ { url: String, tracking: String, trackingDetauls: String } ] }

```

## Example usage with viem

```js
import { get_rcpcs_for_chain, get_rcpcs_for_chains } from 'chainlist-rpc'
import { arbitrum } from 'viem/chains'
import { createPublicClient, fallback, http, formatEther } from 'viem'

const your_private_rpc_endpoints = [ "https://your-private-rpc-endpoint.com", "https://your-private-rpc-endpoint-2.com" ]
const chainlink_rpc_endpoints = get_rcpcs_for_chain( { chain_name: 'arbitrum' } )
const rpc_endpoints = [ ...your_private_rpc_endpoints, ...chainlink_rpc_endpoints ]

const public_client = createPublicClient( {
    chain: arbitrum,
    transport: fallback( rpc_endpoints.map( ( rpc ) => http( rpc ) ) )
} )

const gas_price_wei = await public_client.getGasPrice()
```