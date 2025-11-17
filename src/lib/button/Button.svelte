<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Ripple } from '$lib/index.js';
	import Icon from '$lib/etc/Icon.svelte';
	import Render from '$lib/etc/Render.svelte';
	import Paper from '$lib/paper/Paper.svelte';
	import CircularProgress from '$lib/progress/CircularProgress.svelte';
	import { classes } from '$lib/util.svelte.js';
	import { fade } from 'svelte/transition';

	interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
		primary?: boolean;
		secondary?: boolean;
		icon?: string;
		outlined?: boolean;
		transparent?: boolean;
		raised?: boolean;
		disabled?: boolean;
		round?: boolean;
		small?: boolean;
		large?: boolean;
		tooltip?: string | Record<string, any>;
		active?: boolean;
		full?: boolean;
		children?: any;
		loading?: boolean;

		[k: `light-${number}` | `dark-${number}`]: boolean;
	}

	let {
		children,
		secondary,
		primary = !secondary,
		icon,
		outlined,
		transparent,
		raised,
		disabled,
		round,
		small,
		large,
		tooltip,
		active,
		class: className,
		full = false,
		loading = false,
		...rest
	}: ButtonProps = $props();

	const buttonClass = $derived(
		classes(
			className as any,
			{
				_p: primary,
				_s: secondary,
				o: outlined,
				t: transparent,
				r: raised,
				c: round,
				s: small,
				l: large,
				f: full
			},
			Object.keys(rest).filter((x) => x.startsWith('light-') || x.startsWith('dark-'))
		)
	);
</script>

{#snippet button()}
	<button
		type="button"
		{...rest}
		disabled={disabled || loading}
		class={buttonClass}
		aria-label={tooltip as string}
	>
		{#if icon}
			<Icon {icon} style={children ? 'margin-right: 4px' : ''} />
		{/if}
		<Render {children} />
		{#if !disabled}
			<Ripple {active} />
		{:else}
			<div class="block" transition:fade={{ duration: 200 }}></div>
		{/if}
		{#if loading}
			<div class="ld" transition:fade={{ duration: 200 }}>
				<CircularProgress indeterminate {primary} {secondary} />
			</div>
		{/if}
	</button>
{/snippet}

{#if tooltip}
	{#if typeof tooltip === 'object' && tooltip.children}
		<Paper hover mobile={false} {...tooltip} target={button} />
	{:else}
		<Paper tl hover mobile={false} target={button} children={tooltip} />
	{/if}
{:else}
	{@render button()}
{/if}

<style>
	button {
		-webkit-appearance: none;
		appearance: none;
		background: var(--theme);
		color: var(--on-theme);
		border: none;
		padding: calc(10px - var(--border, 0px)) calc(20px - var(--border, 0px));
		border-radius: 12px;
		cursor: pointer;
		transition:
			background 0.3s,
			box-shadow 0.3s,
			color 0.3s;
		line-height: 1em;
		overflow: hidden;
		position: relative;

		& .block {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			opacity: 0.5;
			z-index: 1;
			background: var(--surface);
			cursor: not-allowed;
		}

		&.s {
			padding: calc(5px - var(--border, 0px)) calc(10px - var(--border, 0px));
			font-size: 0.8rem;
		}

		&.l {
			padding: calc(15px - var(--border, 0px)) calc(30px - var(--border, 0px));
			font-size: 1.2rem;
		}

		&.c {
			border-radius: 1000px;
		}

		&.r:not(:active):not(:disabled) {
			box-shadow: color-mix(in srgb, var(--on-surface), transparent 80%) 0 2px 5px 0;
		}

		&:not(.t):not(.o):hover:not(:active):not(:disabled),
		&:not(.t):not(.o):active:not(:active):not(:disabled) {
			box-shadow: color-mix(in srgb, var(--on-surface), transparent 70%) 0 4px 8px 0;
		}

		&:active {
			box-shadow: none;
		}

		&.f {
			display: block;
			width: 100%;
		}

		&.o {
			--on-theme: var(--theme);
			background: transparent;
			color: var(--theme);
			border: 1px solid var(--theme);
			--border: 1px;
		}

		&.t {
			--on-theme: var(--theme);
			background: transparent;
			color: var(--theme);
		}

		& .ld {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			background: var(--theme);
		}
	}
</style>
