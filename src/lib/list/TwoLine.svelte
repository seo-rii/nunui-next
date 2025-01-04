<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, Render } from '$lib/index.js';
	import type { Renderable } from '$lib/util.svelte.js';
	import Ripple from '../etc/Ripple.svelte';

	interface OneLineProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
		title?: Renderable;
		subtitle?: Renderable;
		icon?: string;
		active?: boolean;
	}

	let { title, subtitle, icon, active, ...rest }: OneLineProps = $props();
</script>

<main {...rest}>
	{#if icon}
		<Icon {icon} />
	{/if}
	<div class="col">
		<div class="title"><Render it={title} /></div>
		<div class="subtitle"><Render it={subtitle} /></div>
	</div>
	<Ripple {active} />
</main>

<style lang="scss">
	main {
		display: flex;
		gap: 4px;
		padding: 8px 12px;
		position: relative;
        align-items: center;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.title {
		font-size: 14px;
		font-weight: 600;
	}

	.subtitle {
		font-size: 12px;
		font-weight: 400;
	}
</style>
