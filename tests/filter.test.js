import { describe, it, expect } from 'vitest'

import { get_rcpcs_for_chains, get_rpcs_for_chain } from '../modules/filter'

describe( 'get_rpcs_for_chain', () => {

    it( 'should return RPCs when called with a valid chain_id', () => {

        const chain_id = 1
        const result = get_rpcs_for_chain( { chain_id } )
        expect( result.length ).to.be.greaterThan( 1 )

    } )

    it( 'should return RPCs when called with a valid chain_name', () => {

        const chain_name = 'ethereum'
        const result = get_rpcs_for_chain( { chain_name } )
        expect( result.length ).to.be.greaterThan( 1 )

    } )

    it( 'Should respect the tracking none setting', () => {

        const chain_id = 1
        const allowed_tracking = [ 'none' ]
        const result = get_rpcs_for_chain( { chain_id, allowed_tracking } )
        const tracking_types = result.reduce( ( acc, { tracking } ) => {
            if( !acc.includes( tracking ) ) {
                acc.push( tracking )
            }
            return acc
        }, [] )
        expect( allowed_tracking.sort() ).toEqual( tracking_types.sort() )

    } )

    it( 'Should respect the tracking limited setting', () => {

        const chain_id = 1
        const allowed_tracking = [ 'limited' ]
        const result = get_rpcs_for_chain( { chain_id, allowed_tracking } )
        const tracking_types = result.reduce( ( acc, { tracking } ) => {
            if( !acc.includes( tracking ) ) {
                acc.push( tracking )
            }
            return acc
        }, [] )
        expect( allowed_tracking.sort() ).toEqual( tracking_types.sort() )

    } )

    it( 'Should respect the tracking yes setting', () => {

        const chain_id = 1
        const allowed_tracking = [ 'yes' ]
        const result = get_rpcs_for_chain( { chain_id, allowed_tracking } )
        const tracking_types = result.reduce( ( acc, { tracking } ) => {
            if( !acc.includes( tracking ) ) {
                acc.push( tracking )
            }
            return acc
        }, [] )
        expect( allowed_tracking.sort() ).toEqual( tracking_types.sort() )

    } )

    it( 'Should respect combined tracking settings', () => {

        const chain_id = 1
        const allowed_tracking = [ 'none', 'limited' ]
        const result = get_rpcs_for_chain( { chain_id, allowed_tracking } )
        const tracking_types = result.reduce( ( acc, { tracking } ) => {
            if( !acc.includes( tracking ) ) {
                acc.push( tracking )
            }
            return acc
        }, [] )
        expect( allowed_tracking.sort() ).toEqual( tracking_types.sort() )
    } )

} )

describe( 'get_rcpcs_for_chains', () => {

    it( 'should return RPCs when called with valid chain_ids', () => {

        const chain_ids = [ 1, 42161 ]
        const result = get_rcpcs_for_chains( { chain_ids } )
        expect( result.length ).to.be.greaterThan( 1 )

    } )

    it( 'should return RPCs when called with valid chain_names', () => {

        const chain_names = [ 'ethereum', 'arbitrum' ]
        const result = get_rcpcs_for_chains( { chain_names } )
        expect( result.length ).to.be.greaterThan( 1 )

    } )

} )