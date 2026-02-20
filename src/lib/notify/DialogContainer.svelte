<script lang="ts">
	import { tick } from 'svelte';
	import { quartOut } from 'svelte/easing';
	import { on } from 'svelte/events';
	import Icon from '$lib/etc/Icon.svelte';
	import Button from '$lib/button/Button.svelte';
	import { closeDialog, type IDialog, dialog } from './dialog.svelte.js';
	import { fade } from 'svelte/transition';
	import Render from '$lib/etc/Render.svelte';

	type DialogAction = NonNullable<IDialog['actions']>[number];

	let actionLoading = $state<Record<string, boolean>>({});
	let activeDialogId = $derived(dialog.active?.id ?? -1);
	let activeTitleId = $derived(`nunui-dialog-title-${activeDialogId}`);
	let activeDescriptionId = $derived(`nunui-dialog-desc-${activeDialogId}`);
	let dialogElement = $state<HTMLElement | null>(null);

	const focusableSelector = [
		'button:not([disabled])',
		'[href]',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	].join(', ');

	const isPromiseLike = (value: unknown): value is Promise<unknown> =>
		typeof value === 'object' &&
		value !== null &&
		'then' in value &&
		typeof (value as { then?: unknown }).then === 'function';

	const actionKey = (index: number) => `${activeDialogId}:${index}`;

	const runAction = (action: DialogAction, index: number) => {
		const key = actionKey(index);
		if (actionLoading[key]) return;
		const result = action.onclick();
		if (!isPromiseLike(result)) return;
		actionLoading[key] = true;
		result.finally(() => {
			actionLoading[key] = false;
		});
	};

	const getFocusableElements = () => {
		if (!dialogElement) return [];
		return [...dialogElement.querySelectorAll<HTMLElement>(focusableSelector)].filter(
			(el) => el.tabIndex >= 0 && el.getAttribute('aria-hidden') !== 'true'
		);
	};

	const focusDialog = () => {
		const [first] = getFocusableElements();
		(first || dialogElement)?.focus();
	};

	$effect(() => {
		const activeId = dialog.active?.id;
		if (activeId === undefined) return;

		const previousFocus =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;
		tick().then(() => focusDialog());
		const offKeydown = on(window, 'keydown', (e) => {
			if (!dialogElement || !dialog.length) return;
			if (e.key === 'Escape') {
				if (dialog.active?.dismissable !== false) {
					e.preventDefault();
					closeDialog();
				}
				return;
			}
			if (e.key !== 'Tab') return;

			const focusables = getFocusableElements();
			if (!focusables.length) {
				e.preventDefault();
				dialogElement.focus();
				return;
			}

			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement as HTMLElement | null;
			if (e.shiftKey) {
				if (active === first || !dialogElement.contains(active)) {
					e.preventDefault();
					last.focus();
				}
				return;
			}
			if (active === last) {
				e.preventDefault();
				first.focus();
			}
		});

		return () => {
			offKeydown();
			previousFocus?.focus();
		};
	});

	function int(node: Element) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = quartOut(t);

				return `transform: scale(${eased * 0.2 + 0.8}) translateY(${(1 - eased) * 10}px);opacity: ${eased};z-index:998;`;
			}
		};
	}

	function out(node: Element) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = quartOut(t);

				return `transform: scale(${eased * 0.2 + 0.8}) translateY(${(1 - eased) * -10}px);opacity: ${eased};z-index:998;`;
			}
		};
	}
</script>

{#snippet dialogUI(dialog: IDialog)}
	{#key dialog.id}
		<div
			class="dialog"
			in:int|global
			out:out|global
			style:--mw={dialog.maxWidth}
			role="dialog"
			aria-modal="true"
			aria-labelledby={activeTitleId}
			aria-describedby={activeDescriptionId}
			tabindex="-1"
			bind:this={dialogElement}
		>
			<h2 class="title" id={activeTitleId}><Icon icon={dialog.icon} />{dialog.title}</h2>
			<div class="text" id={activeDescriptionId}>
				{dialog.text}
				{#if dialog.snip}
					<Render it={dialog.snip} />
				{:else if dialog.comp}
					{@const Comp = dialog.comp}
					<Comp />
				{/if}
			</div>
			{#if dialog.actions?.length}
				<div class="act">
					{#each dialog.actions || [] as act, index (index)}
						<Button
							small
							transparent
							icon={act.icon}
							loading={!!actionLoading[actionKey(index)]}
							onclick={() => runAction(act, index)}
						>
							{act.text}
						</Button>
					{/each}
				</div>
			{/if}
		</div>
	{/key}
{/snippet}

{#if dialog.length}
	<main
		role="presentation"
		onclick={(e) =>
			e.currentTarget === e.target && dialog.active?.dismissable !== false && closeDialog()}
		transition:fade|global={{ duration: 200 }}
	>
		{@render dialogUI(dialog.active)}
	</main>
{/if}

<style>
	main {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1001;
	}

	.dialog {
		padding: 18px;
		background: var(--primary-light1);
		border-radius: 12px;
		box-shadow: color-mix(in srgb, var(--on-surface), transparent 80%) 0 2px 5px 0;
		justify-content: center;
		min-width: min(calc(100svw - 48px), var(--mw, 500px));
		max-width: calc(100svw - 48px);
		max-height: calc(100svh - 56px);
		overflow-y: auto;
		position: relative;

		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.title {
		font-size: 1.4rem;
		font-weight: 300;
		display: flex;
		align-items: center;
		gap: 4px;
		margin: 0 0 8px;
	}

	.text {
		color: color-mix(in srgb, var(--primary-dark3), transparent 20%);
	}

	.act {
		justify-content: flex-end;
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 6px;
	}
</style>
