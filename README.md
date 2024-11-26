# Unofficial chainlist RPC npm module

[![npm version](https://badge.fury.io/js/chainlist-rpcs.svg)](https://badge.fury.io/js/chainlist-rpcs)

This package is a developer-friendly way to access the public RPCs as presented on [chainlist.org](https://chainlist.org/). The RPC endpoint list is maintained by the DefiLlama team at [DefiLlama/chainlist](https://github.com/DefiLlama/chainlist). Keep in mind that these RPC urls are public and do not come with any uptime or performance guarantees.

Installation:
```shell
npm install -S chainlist-rpcs
```

Note that the RPC list is updated once a day automatically, and that every RPC list bump results in a `patch` semver update of this package. You can see the npm deployment history [here](https://github.com/actuallymentor/chainlist-rpcs/actions/workflows/deploy-to-npm.yml).

## Usage of constants

The module exports constants that are objects you can access. The `rpcs` and `chains_by_id` constants which equal the chainlist sources [in this folder of their repository](https://github.com/DefiLlama/chainlist/tree/main/constants). The `chains_by_name` constant is an object that maps chain names to their id.

```js
import { rpcs, chains_by_id, chains_by_name } from 'chainlist-rpcs'

// You can access chain names by their chain id. Chain id 1 is Ethereum mainnet.
console.log( chains[1] ) // Output: "ethereum". Note that this is by chain id and not by index. 1 here refers to chain id 1.

// You can access the RPCs for a chain by its chain id.
console.log( rpcs[1] ) // [ { url: String, tracking: String, trackingDetails: String } ].

// You can access the chain id by its name.
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
export function get_rpcs_for_chains( { chain_ids=[], chain_names=[], allowed_tracking=[] } )

```

Example usage:

```js
import { get_rpcs_for_chains, get_rpcs_for_chains } from 'chainlist-rpcs'

const single_chain_by_id = get_rpcs_for_chains( { chain_id: 1 } ) // Output: [ { url: String, tracking: String, trackingDetails: String } ]
const single_chain_by_name = get_rpcs_for_chains( { chain_name: "ethereum" } ) // Output: [ { url: String, tracking: String, trackingDetails: String } ]

const multiple_chains_by_id = get_rpcs_for_chains( { chain_ids: [1, 42161] } ) // Output: { 1: [ { url: String, tracking: String, trackingDetails: String } ], 42161: [ { url: String, tracking: String, trackingDetails: String } ], ethereum: [ { url: String, tracking: String, trackingDetails: String } ], arbitrum: [ { url: String, tracking: String, trackingDetails: String } ] }

const multiple_chains_by_name = get_rpcs_for_chains( { chain_names: ["ethereum", "arbitrum"] } ) // Output: { 1: [ { url: String, tracking: String, trackingDetails: String } ], 42161: [ { url: String, tracking: String, trackingDetails: String } ], ethereum: [ { url: String, tracking: String, trackingDetails: String } ], arbitrum: [ { url: String, tracking: String, trackingDetails: String } ] }

```

## Example usage with viem

```js
import { get_rpcs_for_chains, get_rpcs_for_chains } from 'chainlist-rpcs'
import { arbitrum } from 'viem/chains'
import { createPublicClient, fallback, http, formatEther } from 'viem'

const your_private_rpc_endpoints = [ "https://your-private-rpc-endpoint.com", "https://your-private-rpc-endpoint-2.com" ]
const chainlink_rpc_endpoints = get_rpcs_for_chains( { chain_name: 'arbitrum' } )
const rpc_endpoints = [ ...your_private_rpc_endpoints, ...chainlink_rpc_endpoints ]

const public_client = createPublicClient( {
    chain: arbitrum,
    transport: fallback( rpc_endpoints.map( ( rpc ) => http( rpc ) ) )
} )

const gas_price_wei = await public_client.getGasPrice()
```