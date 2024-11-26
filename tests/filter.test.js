import { describe, it, expect } from 'vitest'

import { get_rpcs_for_chains, get_rpcs_for_chain, chains_by_name } from '../app'
import { chains_by_id } from '../app'

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

describe( 'get_rpcs_for_chains', () => {

    it( 'should return RPCs when called with valid chain_ids', () => {

        const chain_ids = [ 1, 42161 ]
        const result = get_rpcs_for_chains( { chain_ids } )
        expect( result[1].length ).to.be.greaterThan( 1 )
        expect( result[42161].length ).to.be.greaterThan( 1 )

    } )

    it( 'should return RPCs when called with valid chain_names', () => {

        const chain_names = [ 'ethereum', 'arbitrum' ]
        const result = get_rpcs_for_chains( { chain_names } )
        expect( result[ 'ethereum' ].length ).to.be.greaterThan( 1 )
        expect( result[ 'arbitrum' ].length ).to.be.greaterThan( 1 )

    } )

} )

describe( 'Chain constant should have coherent values', () => {

    it( 'Should have some expected chain ids', () => {
        const expected_chain_ids = [ 1, 42161 ]
        for( const chain_id of expected_chain_ids ) {
            expect( chains_by_id[chain_id] ).toBeDefined()
        }
    } )

    it( 'Should have some expected chain names', () => {
        const expected_chain_names = [ 'ethereum', 'arbitrum' ]
        for( const chain_name of expected_chain_names ) {
            expect( chains_by_name[chain_name] ).toBeDefined()
        }
    } )

} )