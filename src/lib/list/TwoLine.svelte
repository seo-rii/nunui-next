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

	let { title, subtitle, icon, active, onclick, onkeydown, ...rest }: OneLineProps = $props();

	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e as any);
		if (e.defaultPrevented || !onclick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(e as any);
		}
	};
</script>

{#snippet content()}
	{#if icon}
		<Icon {icon} />
	{/if}
	<div class="col">
		<div class="title"><Render it={title} /></div>
		<div class="subtitle"><Render it={subtitle} /></div>
	</div>
	<Ripple {active} />
{/snippet}

{#if onclick}
	<div class="item" {...rest} {onclick} onkeydown={handleKeydown} role="button" tabindex="0">
		{@render content()}
	</div>
{:else}
	<div class="item" {...rest}>
		{@render content()}
	</div>
{/if}

<style>
	.item {
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
