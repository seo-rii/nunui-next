export interface ISnackbar {
	icon?: string;
	text: string;
	actions?: {
		icon?: string;
		text: string;
		onclick: () => void;
	}[];
	duration?: number;
	onclose?: () => void;
	dismissable?: boolean;

	id?: number;
}

export class SnackbarState {
	list = $state([] as ISnackbar[]);
	active = $derived(this.list[0]);
	length = $derived(this.list.length);
	newId = $state(0);
	timeout?: number;

	invokeOnclose(snackbar?: ISnackbar) {
		if (!snackbar?.onclose) return;
		try {
			snackbar.onclose();
		} catch (error) {
			console.error('Snackbar onclose callback failed', error);
		}
	}

	shiftActive() {
		const closed = this.list.shift();
		this.invokeOnclose(closed);
	}

	add(snackbar: ISnackbar) {
		this.list.push({ ...snackbar, id: this.newId++ });
		if (!this.timeout) this.next();
	}

	close() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = undefined;
		}
		this.shiftActive();
		if (this.list.length) this.next();
	}

	next() {
		this.timeout = setTimeout(() => {
			this.shiftActive();
			this.timeout = undefined;
			if (this.list.length) this.next();
		}, this.active?.duration || 5000);
	}
}

export const snack = new SnackbarState();

export function addSnackbar(snackbar: ISnackbar) {
	snack.add(snackbar);
}

export function closeSnackbar() {
	snack.close();
}
