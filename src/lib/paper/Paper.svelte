<script lang="ts">
	import PaperDesktop from '$lib/paper/PaperDesktop.svelte';
	import { getContext } from 'svelte';
	import { delayedToggle, hovering, type Renderable } from '$lib/util.svelte.js';
	import { Render } from '$lib/index.js';
	import PaperMobile from '$lib/paper/PaperMobile.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface PaperProps extends HTMLAttributes<HTMLDivElement> {
		children?: any;
		hover?: boolean;
		mobile?: boolean;
		target?: Renderable;
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
	}

	const mobile = getContext<{ v: boolean }>('mobile');
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
		show: _show = $bindable(false),
		mobile: _mobile,
		dense = false,

		hover: _hover = false,
		by = _hover ? 'hover' : 'click'
	}: PaperProps = $props();

	let useMobile = $derived(_mobile === undefined ? mobile.v : _mobile);
	let hover = delayedToggle(false);
	let show = $state(_show);
	let iv = 0,
		ig = false;

	$effect(() => {
		if (by === 'hover') _show = hover.v;
	});

	$effect(() => {
		if (_show) show = true;
		else {
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main
	class:inlineBlock
	class:block
	onclick={() => {
		if (ig) return;
		ig = true;
		_show = !_show;
	}}
	use:hovering={hover}
>
	<Render it={target} />
	{#if show}
		{#if useMobile}
			<PaperMobile bind:show={_show} onclick={() => (ig = true)}>
				<div class="mobile" class:dense>
					<Render {children} />
				</div>
			</PaperMobile>
		{:else}
			<PaperDesktop
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
			>
				<div class="desktop" class:dense>
					<Render {children} />
				</div>
			</PaperDesktop>
		{/if}
	{/if}
</main>

<style lang="scss">
	main {
		position: relative;

		&.block {
			display: block;
		}

		&.inlineBlock {
			display: inline-block;
		}
	}

	.desktop {
		padding: 4px;
	}

	.mobile {
		padding: 12px;
	}

	.dense {
		padding: 0;
	}
</style>
