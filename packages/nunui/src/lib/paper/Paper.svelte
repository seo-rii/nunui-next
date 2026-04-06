<script lang="ts">
	import PaperDesktop from '$lib/paper/PaperDesktop.svelte';
	import { getContext } from 'svelte';
	import { delayedToggle, hovering, type Renderable } from '$lib/util.svelte.js';
	import { Render } from '$lib/index.js';
	import PaperMobile from '$lib/paper/PaperMobile.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type SvelteKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement };

	interface PaperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		children?: Renderable;
		hover?: boolean;
		mobile?: boolean;
		target?: Renderable;
		automove?:
			| boolean
			| {
					threshold?: number | { vertical?: number; horizontal?: number };
					ratio?: number | { vertical?: number; horizontal?: number };
			  };
		tl?: boolean;
		tc?: boolean;
		tr?: boolean;
		ml?: boolean;
		mr?: boolean;
		bl?: boolean;
		bc?: boolean;
		br?: boolean;
		top?: boolean;
		bottom?: boolean;
		left?: boolean;
		right?: boolean;
		center?: boolean;
		style?: string;

		block?: boolean;
		inlineBlock?: boolean;

		show?: boolean;
		dense?: boolean;

		by?: 'hover' | 'click';
		remap?: boolean;

		onclick?: (e?: MouseEvent | KeyboardEvent) => void;
	}

	const config = getContext<{ mobile: boolean }>('config');
	let {
		children,
		target,

		block,
		inlineBlock = !block,
		tl,
		tc,
		tr,
		ml,
		mr,
		bl,
		bc,
		br,
		automove = true,
		show: _show = $bindable(false),
		mobile: _mobile,
		dense = false,

		hover: _hover = false,
		by = _hover ? 'hover' : 'click',

		remap = false,
		onclick,
		onkeydown,
		...rest
	}: PaperProps = $props();

	let useMobile = $derived(_mobile === undefined ? config.mobile : _mobile);
	let hover = delayedToggle(false);
	let hoverTarget = delayedToggle(false);
	let show = $state(_show);
	let triggerTarget = $state<HTMLElement | null>(null);
	let panel = $state<HTMLElement | null>(null);
	let targetHasFocusable = $state(false);
	let iv = 0,
		ig = false;

	const focusableSelector = [
		'button:not([disabled])',
		'[href]',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	].join(', ');

	const getFocusable = (node: ParentNode | null): HTMLElement[] => {
		if (!node) return [];
		const focusable = [...node.querySelectorAll<HTMLElement>(focusableSelector)];
		return focusable.filter((el) => {
			if (el.hasAttribute('disabled')) return false;
			if (el.getAttribute('aria-hidden') === 'true') return false;
			return el.getClientRects().length > 0;
		});
	};

	const handleToggle = (e?: MouseEvent | KeyboardEvent) => {
		if ((e as MouseEvent & { __paperRemapForwarded?: boolean })?.__paperRemapForwarded) {
			ig = true;
			return;
		}
		onclick?.(e);
		if (ig) return;
		ig = true;
		_show = !_show;
	};

	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e as SvelteKeyboardEvent);
		if (e.defaultPrevented) return;

		if (e.key === 'Tab' && !e.shiftKey && _show) {
			const active = document.activeElement as HTMLElement | null;
			const current = e.currentTarget as HTMLElement | null;
			const onTrigger = (!!active && !!triggerTarget?.contains(active)) || active === current;
			if (onTrigger) {
				const next = getFocusable(panel)[0];
				if (next) {
					e.preventDefault();
					next.focus();
					return;
				}
			}
		}

		if (targetHasFocusable) return;
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		handleToggle(e);
	};

	$effect(() => {
		if (!triggerTarget) return;
		targetHasFocusable = !!triggerTarget.querySelector(focusableSelector);
	});

	$effect(() => {
		if (by === 'hover' && !useMobile) _show = hover.v || hoverTarget.v;
	});

	$effect(() => {
		if (_show) {
			show = true;
			if (iv) clearTimeout(iv);
		} else {
			if (iv) clearTimeout(iv);
			iv = setTimeout(() => (show = false), 200);
		}
	});

	$effect(() => {
		const handler = (e: MouseEvent) => {
			if (ig) ig = false;
			else _show = false;
		};
		window.addEventListener('click', handler);
		return () => window.removeEventListener('click', handler);
	});
</script>

{#snippet content()}
	<div class="target" bind:this={triggerTarget}>
		<Render it={target} />
	</div>
	{#if show}
		{#if useMobile}
			<PaperMobile bind:show={_show} bind:panel onclick={() => (ig = true)} {remap} {...rest}>
				<div class="m" class:dense use:hovering={hoverTarget}>
					<Render {children} />
				</div>
			</PaperMobile>
		{:else}
			<PaperDesktop
				bind:panel
				{remap}
				bind:show={_show}
				onclick={() => (ig = true)}
				{tl}
				{tc}
				{tr}
				{ml}
				{mr}
				{bl}
				{bc}
				{br}
				{automove}
				{...rest}
			>
				<div class="d" class:dense use:hovering={hoverTarget}>
					<Render {children} />
				</div>
			</PaperDesktop>
		{/if}
	{/if}
{/snippet}

<div
	class="trigger"
	class:i={inlineBlock}
	class:b={block}
	role="button"
	tabindex={targetHasFocusable ? -1 : 0}
	aria-expanded={_show}
	onclick={handleToggle}
	onkeydown={handleKeydown}
	use:hovering={hover}
>
	{@render content()}
</div>

<style>
	.trigger {
		position: relative;

		&.b {
			display: block;
		}

		&.i {
			display: inline-block;
		}
	}

	.target {
		display: contents;
	}

	.d {
		padding: 4px;
	}

	.m {
		padding: 12px;
	}

	.dense {
		padding: 0;
	}
</style>
