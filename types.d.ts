export type TrackingType = "none" | "limited" | "yes" | "unspecified" | "unknown";

export interface RPCEndpoint {
	url: string;
	tracking: TrackingType;
	trackingDetails?: string;
	isOpenSource?: boolean;
}
// from constants/chainIds.js
export const chains_by_id: {
	[chainId: string]: string;
};

// from modules/rpcs.js
export const rpcs: {
	[chainId: string]: RPCEndpoint[];
};

// from modules/chains.js
export const chains_by_name: {
	[chainName: string]: string;
};


// from modules/filter.js
export interface GetRPCsForChainParams {
	chain_id?: number | string;
	chain_name?: string;
	allowed_tracking?: TrackingType[];
}

export function get_rpcs_for_chain(
	params: GetRPCsForChainParams,
): (string | RPCEndpoint)[];

export interface GetRPCsForChainsParams {
	chain_ids?: (number | string)[];
	chain_names?: string[];
	allowed_tracking?: TrackingType[];
}

export function get_rpcs_for_chains(params: GetRPCsForChainsParams): {
	[key: string | number]: (string | RPCEndpoint)[];
};
