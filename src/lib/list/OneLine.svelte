<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, Render } from '$lib/index.js';
	import type { Renderable } from '$lib/util.svelte.js';
	import Ripple from '../etc/Ripple.svelte';

	interface OneLineProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
		title?: Renderable;
		icon?: string;
	}

	let { title, icon, ...rest }: OneLineProps = $props();
</script>

<main {...rest}>
	{#if icon}
		<Icon {icon} />
	{/if}
	<Render it={title} />
	<Ripple />
</main>

<style lang="scss">
	main {
		display: flex;
		gap: 4px;
		padding: 8px 12px;
		position: relative;
        align-items: center;
	}
</style>
