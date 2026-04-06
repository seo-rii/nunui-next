<script lang="ts">
	import type { Renderable } from '$lib/util.svelte.js';
	import type { Snippet } from 'svelte';

	interface RenderType {
		children?: Renderable;
		it?: Renderable;
	}

	let { children = undefined, it = undefined }: RenderType = $props();

	let target = $derived<Renderable>(children || it);
</script>

{#if typeof target === 'string' || typeof target === 'number'}
	{target}
{:else if !(target === null || target === undefined || target === false)}
	{@render (target as Snippet)?.()}
{/if}
