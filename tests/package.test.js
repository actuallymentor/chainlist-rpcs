import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { build } from 'vite'

const root = fileURLToPath( new URL( '../', import.meta.url ) )
const consumer = mkdtempSync( join( tmpdir(), `chainlist-consumer-` ) )
const run_node = ( source, mode ) => execFileSync( process.execPath, [ `--input-type=${ mode }`, `--eval`, source ], { cwd: consumer, encoding: `utf8` } )

// Exercise the published artifact outside Vite's permissive module resolver.
beforeAll( () => {

    const output = execFileSync( `npm`, [ `pack`, `--json`, `--pack-destination`, consumer ], { cwd: root, encoding: `utf8` } )
    const [ { filename, files } ] = JSON.parse( output )
    const paths = files.map( ( { path } ) => path )

    expect( paths ).toContain( `types.d.ts` )
    expect( paths.every( path => /^(app\.js|types\.d\.ts|package\.json|README\.md|CHANGELOG\.md|(modules|constants|utils)\/[^/]+\.js)$/.test( path ) ) ).toBe( true )

    writeFileSync( join( consumer, `package.json` ), JSON.stringify( { private: true, type: `module` } ) )
    execFileSync( `npm`, [ `install`, join( consumer, filename ), `--ignore-scripts`, `--no-audit`, `--no-fund`, `--no-package-lock` ], { cwd: consumer } )

}, 30_000 )

afterAll( () => rmSync( consumer, { recursive: true, force: true } ) )

describe( `published package`, () => {

    it( `loads with native Node ESM`, () => {

        const output = run_node( `
            import { rpcs, chains_by_id, chains_by_name, get_rpcs_for_chain, get_rpcs_for_chains } from 'chainlist-rpcs'
            import assert from 'node:assert/strict'

            assert.equal( chains_by_id[1], 'ethereum' )
            assert.equal( chains_by_name.ethereum, '1' )
            assert.ok( rpcs[1].length )
            assert.ok( get_rpcs_for_chain( { chain_id: 1 } ).length )
            assert.ok( get_rpcs_for_chains( { chain_names: [ 'arbitrum' ] } ).arbitrum.length )
            console.log( 'ok' )
        `, `module` )

        expect( output.trim() ).toBe( `ok` )

    } )

    it( `loads from CommonJS via dynamic import`, () => {

        const output = run_node( `
            import( 'chainlist-rpcs' ).then( ( { chains_by_id } ) => {
                if( chains_by_id[1] !== 'ethereum' ) throw new Error( 'Missing Ethereum' )
                console.log( 'ok' )
            } )
        `, `commonjs` )

        expect( output.trim() ).toBe( `ok` )

    } )

    it.each( [ [ `NodeNext`, `NodeNext` ], [ `Bundler`, `ESNext` ] ] )( `resolves TypeScript declarations with %s`, ( resolution, module ) => {

        const fixture = join( consumer, `consumer.mts` )
        writeFileSync( fixture, `
            import { rpcs, chains_by_id, chains_by_name, get_rpcs_for_chain, get_rpcs_for_chains } from 'chainlist-rpcs'
            import type { RPCEndpoint, TrackingType } from 'chainlist-rpcs'

            const tracking: TrackingType[] = [ 'none', 'limited' ]
            const endpoint: RPCEndpoint = rpcs[1][0]
            const name: string = chains_by_id[1]
            const id: string = chains_by_name[name]
            const single: (string | RPCEndpoint)[] = get_rpcs_for_chain( { chain_id: id, allowed_tracking: tracking } )
            const multiple: Record<string, (string | RPCEndpoint)[]> = get_rpcs_for_chains( { chain_names: [ name ] } )
            // @ts-expect-error Invalid tracking values must be rejected.
            get_rpcs_for_chain( { allowed_tracking: [ 'invalid' ] } )
        ` )

        execFileSync( process.execPath, [ join( root, `node_modules/typescript/bin/tsc` ), `--noEmit`, `--strict`, `--target`, `ES2022`, `--module`, module, `--moduleResolution`, resolution, fixture ], { cwd: consumer } )

    } )

    it( `bundles for the browser without Node shims`, async () => {

        const entry = join( consumer, `entry.js` )
        writeFileSync( entry, `export * from 'chainlist-rpcs'` )
        await build( {
            configFile: false,
            root: consumer,
            logLevel: `silent`,
            build: { lib: { entry, formats: [ `es` ], fileName: () => `bundle.js` }, minify: false }
        } )

        const bundle = readFileSync( join( consumer, `dist/bundle.js` ), `utf8` )
        expect( bundle ).not.toContain( `__vite-browser-external` )
        const output = run_node( `import { chains_by_id } from './dist/bundle.js'; console.log( chains_by_id[1] )`, `module` )
        expect( output.trim() ).toBe( `ethereum` )

    } )

} )
