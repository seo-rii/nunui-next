<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Ripple, Icon, Paper } from '$lib/index.js';
	import { fade } from 'svelte/transition';

	interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
		flat?: boolean;
		disabled?: boolean;
		secondary?: boolean;
		primary?: boolean;
		active?: boolean;
		outlined?: boolean;
		icon: string;
		size?: number | string;
		label?: string;
		tooltip?: string | Record<string, any>;
	}

	let {
		flat,
		disabled,
		secondary,
		primary = !secondary,
		active,
		outlined,
		icon,
		size,
		label,
		tooltip,
		...rest
	}: IconButtonProps = $props();

	let container = $state<HTMLButtonElement | null>(null);
	let clicked = $state(false);
	let hover = $state(false);
</script>

{#snippet button()}
	<button {...rest} {disabled} bind:this={container}>
		<div class="container" style:--size={+(size as number) ? size + 'px' : size || '1.8em'}>
			<div class="wrapper" class:flat>
				<div class="button" class:flat>
					<Icon
						{icon}
						weight={disabled ? 300 : clicked ? 200 : hover ? 500 : 300}
						outlined={outlined === undefined ? !active : outlined}
					/>
				</div>
				{#if !disabled}
					<Ripple center bind:clicked bind:hover {active} extra={container} {primary} {secondary} />
				{:else}
					<div class="block" transition:fade={{ duration: 200 }}></div>
				{/if}
			</div>
			{#if label}
				<div class="label">{label}</div>
			{/if}
		</div>
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

<style lang="scss">
	button {
		-webkit-appearance: none;
		appearance: none;
		display: inline-block;
		border: none;
		background: transparent;
		padding: 0;
		color: var(--on-surface);
		overflow: hidden;
		position: relative;

		.block {
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

		.container {
			display: flex;
			flex-direction: column;
			cursor: pointer;

			.label {
				margin-top: 2px;
				font-size: calc(var(--size) * 0.4);
				text-align: center;
			}

			.wrapper {
				border-radius: 100px;
				display: inline-block;
				position: relative;
				overflow: hidden;
				cursor: pointer;
				width: var(--size);
				height: var(--size);
				margin: auto;

				&.flat {
					width: calc(var(--size) * 1.25);
					height: calc(var(--size) * 0.75);
				}

				.button {
					width: var(--size);
					height: var(--size);
					display: flex;
					align-items: center;
					justify-content: center;
					user-select: none;
					transition: all 0.2s;

					& :global(*) {
						font-size: calc(var(--size) * 0.7);
						line-height: calc(var(--size) * 0.7);
					}

					&.flat {
						width: calc(var(--size) * 1.25);
						height: calc(var(--size) * 0.75);
					}
				}
			}
		}
	}
</style>
