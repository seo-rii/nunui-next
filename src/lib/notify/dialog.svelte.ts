import type { Component, Snippet } from 'svelte';

export interface IDialog {
	icon?: string;
	title: string;
	text?: string;
	snip?: Snippet;
	comp?: Component;
	actions?: {
		icon?: string;
		text: string;
		onclick: () => void | Promise<unknown>;
	}[];
	onclose?: () => void;
	dismissable?: boolean;

	id?: number;
	maxWidth?: string;

	front?: boolean;
}

export class DialogState {
	list = $state([] as IDialog[]);
	active = $derived(this.list[0]);
	length = $derived(this.list.length);
	newId = $state(0);

	invokeOnclose(dialog?: IDialog) {
		if (!dialog?.onclose) return;
		try {
			dialog.onclose();
		} catch (error) {
			console.error('Dialog onclose callback failed', error);
		}
	}

	add(dialog: IDialog) {
		if (dialog.front) this.list.unshift({ ...dialog, id: this.newId++ });
		else this.list.push({ ...dialog, id: this.newId++ });
	}

	close() {
		const closed = this.list.shift();
		this.invokeOnclose(closed);
	}
}

export const dialog = new DialogState();

export function addDialog(dialogOpt: IDialog) {
	dialog.add(dialogOpt);
}

export function closeDialog() {
	dialog.close();
}
