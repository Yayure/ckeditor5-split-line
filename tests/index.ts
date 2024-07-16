import { expect } from 'chai';
import { SplitLine as SplitLineDll } from '../src';
import SplitLine from '../src/splitline';

describe( 'CKEditor5 SplitLine DLL', () => {
	it( 'exports SplitLine', () => {
		expect( SplitLineDll ).to.equal( SplitLine );
	} );
} );
