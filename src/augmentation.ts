import type { SplitLine } from './index';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ SplitLine.pluginName ]: SplitLine;
	}
}
