<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Render } from '$lib/index.js';
	import type { Renderable } from '$lib/util.svelte.js';
	import OneLine from './OneLine.svelte';
	import TwoLine from './TwoLine.svelte';

	interface ListItem {
		title: Renderable;
		subtitle?: Renderable;
		icon?: string;
		onclick?: () => void;
	}

	interface ListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		list?: ListItem[];
		children?: Renderable;
	}

	let { children, list, ...rest }: ListProps = $props();
</script>

<div {...rest}>
	{#if list}
		{#each list as item}
			{#if item.subtitle}
				<TwoLine {...item} />
			{:else}
				<OneLine {...item} />
			{/if}
		{/each}
	{/if}
	<Render {children} />
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
	}
</style>
