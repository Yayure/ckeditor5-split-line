import type {
	SplitLine,
	SplitLineEditing,
	SplitLineUI,
	SplitLineCommand,
	SplitlineConfig
} from './index';

declare module '@ckeditor/ckeditor5-core' {
	interface EditorConfig {

		splitLine?: SplitlineConfig;

	}

	interface PluginsMap {
		[ SplitLine.pluginName ]: SplitLine;
		[ SplitLineEditing.pluginName ]: SplitLineEditing;
		[ SplitLineUI.pluginName ]: SplitLineUI;
	}

	interface CommandsMap {
		splitLine: SplitLineCommand;
	}
}
