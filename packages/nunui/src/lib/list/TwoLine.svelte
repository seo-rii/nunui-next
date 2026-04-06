<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon, Render } from '$lib/index.js';
	import type { Renderable } from '$lib/util.svelte.js';
	import Ripple from '../etc/Ripple.svelte';

	type SvelteMouseEvent = MouseEvent & { currentTarget: EventTarget & HTMLElement };
	type SvelteKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLElement };

	interface TwoLineProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
		title?: Renderable;
		subtitle?: Renderable;
		icon?: string;
		active?: boolean;
		rippleColor?: string;
		trailingIcon?: string;
	}

	let {
		title,
		subtitle,
		icon,
		active,
		rippleColor,
		trailingIcon,
		onclick,
		onkeydown,
		class: className = '',
		role: roleProp,
		tabindex: tabindexProp,
		...rest
	}: TwoLineProps = $props();

	const handleKeydown = (e: KeyboardEvent) => {
		onkeydown?.(e as SvelteKeyboardEvent);
		if (e.defaultPrevented || !onclick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(e as unknown as SvelteMouseEvent);
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
	{#if trailingIcon}
		<Icon class="tail option-check" icon={trailingIcon} />
	{/if}
	<Ripple {active} />
{/snippet}

{#if onclick}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class={`item ${className}`.trim()}
		style:--ripple-color={rippleColor || undefined}
		{...rest}
		{onclick}
		onkeydown={handleKeydown}
		role={roleProp ?? 'button'}
		tabindex={tabindexProp ?? 0}
	>
		{@render content()}
	</div>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class={`item ${className}`.trim()}
		style:--ripple-color={rippleColor || undefined}
		{...rest}
		onkeydown={handleKeydown}
		role={roleProp}
		tabindex={tabindexProp}
	>
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
		flex: 1;
		min-width: 0;
	}

	.title {
		font-size: 14px;
		font-weight: 600;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.subtitle {
		font-size: 12px;
		font-weight: 400;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tail {
		margin-left: auto;
		flex-shrink: 0;
	}
</style>
