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
		onclick: () => void;
	}[];
	onclose?: () => void;
	dismissable?: boolean;

	id?: number;
	maxWidth?: string;
}

export class DialogState {
	list = $state([] as IDialog[]);
	active = $derived(this.list[0]);
	length = $derived(this.list.length);
	newId = $state(0);

	add(dialog: IDialog) {
		this.list.push({ ...dialog, id: this.newId++ });
	}

	close() {
		this.list.shift();
	}
}

export const dialog = new DialogState();

export function addDialog(dialogOpt: IDialog) {
	dialog.add(dialogOpt);
}

export function closeDialog() {
	dialog.close();
}
