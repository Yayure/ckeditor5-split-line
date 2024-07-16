import { Plugin } from 'ckeditor5/src/core';
import { Widget } from 'ckeditor5/src/widget';

import SplitLineEditing from './splitlineediting';
import SplitLineUI from './splitlineui';

export default class SplitLine extends Plugin {
	public static get requires() {
		return [ SplitLineEditing, SplitLineUI, Widget ] as const;
	}

	public static get pluginName() {
		return 'SplitLine' as const;
	}
}
