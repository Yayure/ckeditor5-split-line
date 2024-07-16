import { Command, type Editor } from 'ckeditor5/src/core';
import type { DocumentSelection, Element, DocumentFragment } from 'ckeditor5/src/engine';

export default class SplitLineCommand extends Command {
	declare public value: string;
	declare public isAddButtonEnabled: boolean;

	constructor( editor: Editor, defalutValue?: string ) {
		super( editor );

		this.value = defalutValue || '';
	}

	public override refresh(): void {
		const model = this.editor.model;
		const selection = model.document.selection;

		this.isEnabled = !isCursorInTable( selection );
	}

	public override execute(): void {
		const model = this.editor.model;
		const value = this.value;

		model.change( writer => {
			const splitLineElement = writer.createElement( 'splitLine', {
				value
			} );

			model.insertObject( splitLineElement, null, null, {
				setSelection: 'after'
			} );
		} );
	}
}

function isCursorInTable( selection: DocumentSelection ): boolean {
	let cursorInTable = false;
	const anchor = selection.anchor?.parent;

	( ( function recursion( parent?: Element | DocumentFragment | null ): void {
		if ( !parent ) {
			return;
		}

		if ( parent.name === 'tableCell' ) {
			cursorInTable = true;
		} else {
			recursion( parent.parent );
		}
	} )( anchor ) );

	return cursorInTable;
}
