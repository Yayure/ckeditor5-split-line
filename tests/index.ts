import { expect } from 'chai';
import { SplitLine as SplitLineDll, icons } from '../src';
import SplitLine from '../src/splitline';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 SplitLine DLL', () => {
	it( 'exports SplitLine', () => {
		expect( SplitLineDll ).to.equal( SplitLine );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
