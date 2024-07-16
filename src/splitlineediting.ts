
import { Plugin, type Editor } from 'ckeditor5/src/core';
import { toWidget } from 'ckeditor5/src/widget';
import { normalizeOptions } from './utils';
import type { ViewElement } from 'ckeditor5/src/engine';

import SplitLineCommand from './splitlinecommand';

import '../theme/splitline.css';

export default class SplitLineEditing extends Plugin {
	public static get pluginName() {
		return 'SplitLineEditing' as const;
	}

	constructor( editor: Editor ) {
		super( editor );

		const t = editor.t;
		editor.config.define( 'splitLine', {
			options: [ t( 'PAGE BREAK' ) ]
		} );
	}

	public init(): void {
		const editor = this.editor;
		const schema = editor.model.schema;
		const conversion = editor.conversion;
		const options = normalizeOptions( editor.config.get( 'splitLine.options' )! );

		schema.register( 'splitLine', {
			allowWhere: '$block',
			isBlock: true,
			isObject: true,
			disallowIn: [ 'tableCell' ],
			allowAttributes: [ 'value' ]
		} );

		conversion.for( 'dataDowncast' ).elementToStructure( {
			model: 'splitLine',
			view: ( modelElement, { writer } ) => {
				const value = modelElement.getAttribute( 'value' ) as string;
				const divElement = writer.createContainerElement( 'div',
					{
						class: 'split-line',
						style: 'page-break-after: always'
					},
					writer.createContainerElement( 'span', {
						style: 'display: none'
					}, writer.createText( value ) )
				);

				return divElement;
			}
		} );

		conversion.for( 'editingDowncast' ).elementToStructure( {
			model: 'splitLine',
			view: ( modelElement, { writer } ) => {
				const label = modelElement.getAttribute( 'value' ) as string;
				const viewWrapper = writer.createContainerElement( 'div' );
				const viewLabelElement = writer.createRawElement(
					'span',
					{ class: 'split-line__label' },
					function( domElement ) {
						domElement.innerText = label;
					}
				);

				writer.addClass( 'split-line', viewWrapper );
				writer.insert( writer.createPositionAt( viewWrapper, 0 ), viewLabelElement );

				return toWidget( viewWrapper, writer, { label } );
			}
		} );

		conversion.for( 'upcast' )
			.elementToElement( {
				view: {
					classes: [ 'split-line' ],
					styles: {
						'page-break-after': 'always'
					}
				},
				model: ( viewElement, { writer } ) => {
					const child = viewElement.getChild( 0 ) as ViewElement;
					const valueChild = child?.getChild( 0 );

					if ( valueChild?.is( '$text' ) ) {
						const value = valueChild.data.trim();

						return writer.createElement(
							'splitLine',
							{
								value
							}
						);
					}
					return writer.createElement( 'splitLine' );
				}
			} );

		editor.commands.add( 'splitLine', new SplitLineCommand( editor, options[ 0 ].value ) );
	}
}

