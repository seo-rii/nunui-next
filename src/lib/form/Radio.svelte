<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Render, Ripple } from '$lib/index.js';
	import { uniqueId } from '$lib/util.svelte.js';
	import type { Renderable } from '$lib/util.svelte.js';

	interface RadioProps extends Omit<HTMLInputAttributes, 'value'> {
		name?: string;
		secondary?: boolean;
		primary?: boolean;
		label?: Renderable;
		id?: string;
		value?: string | number | boolean | undefined;
		selected?: string | number | boolean | null;
	}

	let {
		name,
		secondary,
		primary = !secondary,
		label,
		id: _id,
		value,
		selected = $bindable(null),
		...rest
	}: RadioProps = $props();

	let id = $derived(_id || uniqueId('radio'));
	let target = $state<HTMLInputElement | null>(null);
	let container = $state<HTMLElement | null>(null);
</script>

<main
	bind:this={container}
	class:_p={primary}
	class:_s={secondary}
	role="presentation"
	onclick={(e) => {
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag !== 'INPUT' && tag !== 'LABEL') return;
		//target?.click();
	}}
>
	<div>
		<Ripple extra={container} center />
		<input {id} type="radio" {name} {value} bind:this={target} bind:group={selected} {...rest} />
	</div>
	{#if label}
		<label for={id}>
			<Render it={label} />
		</label>
	{/if}
</main>

<style>
	main {
		cursor: pointer;

		&:has(input:disabled) {
			cursor: not-allowed;
		}
	}

	main :global(*) {
		cursor: inherit;
	}

	main {
		display: inline-block;
		--on-theme: var(--theme);
	}

	div {
		display: inline-block;
		border-radius: 100px;
		width: 1.75em;
		height: 1.75em;
		position: relative;
		vertical-align: middle;
	}

	label {
		vertical-align: middle;
	}

	input {
		-webkit-appearance: none;
		appearance: none;
		margin: 6px;
		padding: 0;
		width: calc(100% - 12px);
		height: calc(100% - 12px);
		border-radius: 100px;
		outline: none;
		position: relative;

		&:focus-visible {
			outline: 2px solid color-mix(in srgb, var(--theme), transparent 40%);
			outline-offset: 2px;
		}

		&:before {
			content: '';
			border: solid 2px color-mix(in srgb, var(--on-surface), var(--surface) 30%);
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			border-radius: 100px;
			transition: border-color 0.2s;
		}

		&:after {
			content: '';
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background: var(--theme);
			transform: scale(0);
			transition: transform 0.2s;
		}

		&:checked {
			&:before {
				border-color: var(--theme);
			}

			&:after {
				transform: scale(0.5);
			}
		}
	}
</style>
