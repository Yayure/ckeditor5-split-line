
import type { SplitLineOption } from './splitlineconfig';

export function normalizeOptions( configuredOptions: Array<string | SplitLineOption> ): Array<SplitLineOption> {
	return configuredOptions
		.map( item => getOptionDefinition( item ) )
		.filter( ( option ): option is SplitLineOption => option !== undefined );
}

function getOptionDefinition( option: string | SplitLineOption ): SplitLineOption | undefined {
	if ( typeof option === 'object' ) {
		return option;
	}

	return {
		title: option,
		value: option
	};
}
