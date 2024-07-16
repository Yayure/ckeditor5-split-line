
import { Plugin, type Editor } from 'ckeditor5/src/core';
import {
	View,
	ViewModel,
	createDropdown,
	addListToDropdown,
	type ButtonExecuteEvent,
	type ListDropdownItemDefinition,
	ButtonView
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import { normalizeOptions } from './utils';
import type { SplitLineCommand } from './index';

import splitLineIcon from '../theme/icons/splitline.svg';

export default class SplitLineUI extends Plugin {
	public static get pluginName() {
		return 'SplitLineUI' as const;
	}

	public init(): void {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'splitLine', () => {
			const editor = this.editor;

			const view = new SplitLineButtonView( editor );

			return view;
		} );
	}
}

class SplitLineButtonView extends View {
	public declare editor: Editor;

	constructor( editor: Editor ) {
		super( editor.locale );

		this.editor = editor;

		this.setTemplate( {
			tag: 'div',

			attributes: {
				class: [ 'ck-split-line-button-group' ]
			},

			children: [
				this._createAddSplitLineButton(),
				this._createSplitLineMenu()
			]
		} );
	}

	public _createAddSplitLineButton() {
		const editor = this.editor;
		const t = editor.t;
		const splitLineCommand: SplitLineCommand = editor.commands.get( 'splitLine' )!;
		const view = new ButtonView( editor.locale );

		view.set( {
			label: t( 'Split line' ),
			icon: splitLineIcon
		} );

		view.bind( 'isEnabled' ).to( splitLineCommand, 'isEnabled' );

		this.listenTo( view, 'execute', () => {
			editor.execute( 'splitLine' );
			editor.editing.view.focus();
		} );

		view.set( {
			tooltip: true
		} );

		return view;
	}

	public _createSplitLineMenu() {
		const editor = this.editor;
		const locale = this.locale;
		const accessibleLabel = '拆分结构';
		const options = normalizeOptions( editor.config.get( 'splitLine.options' )! );
		const titles: Record<string, string> = {};
		const itemDefinitions: Collection<ListDropdownItemDefinition> = new Collection();
		const splitLineCommand: SplitLineCommand = editor.commands.get( 'splitLine' )!;

		for ( const option of options ) {
			const def: ListDropdownItemDefinition = {
				type: 'button',
				model: new ViewModel( {
					label: option.title,
					class: '',
					role: 'menuitemradio',
					withText: true
				} )
			};

			def.model.bind( 'isOn' ).to( splitLineCommand, 'value', value => {
				return value === option.value;
			} );
			def.model.set( {
				value: option.value
			} );

			itemDefinitions.add( def );

			titles[ option.value ] = option.title;
		}

		const dropdownView = createDropdown( locale );
		addListToDropdown( dropdownView, itemDefinitions, {
			ariaLabel: accessibleLabel,
			role: 'menu'
		} );

		dropdownView.bind( 'isEnabled' ).to( splitLineCommand, 'isEnabled' );

		dropdownView.set( {
			class: 'ck-split-line-dropdown'
		} );

		dropdownView.buttonView.set( {
			ariaLabel: accessibleLabel,
			ariaLabelledBy: undefined,
			isOn: false,
			withText: true
			// tooltip: accessibleLabel
		} );

		dropdownView.buttonView.bind( 'label' ).to( splitLineCommand, 'value', splitLine => {
			return titles[ splitLine ];
		} );

		dropdownView.buttonView.bind( 'ariaLabel' ).to( splitLineCommand, 'value', splitLine => {
			if ( splitLine ) {
				return `${ titles[ splitLine ] }, ${ accessibleLabel }`;
			}
			return accessibleLabel;
		} );

		this.listenTo<ButtonExecuteEvent>( dropdownView, 'execute', evt => {
			const splitLineCommand: SplitLineCommand = editor.commands.get( 'splitLine' )!;

			const { value } = evt.source as any;

			splitLineCommand.value = value;

			editor.editing.view.focus();
		} );

		return dropdownView;
	}
}
