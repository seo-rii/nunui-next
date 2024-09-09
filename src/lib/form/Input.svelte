<script context="module">
	let counter = 0;

	function getCounter() {
		return `nunui-input-${counter++}`;
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import { Icon, Render } from '$lib/index.js';
	import IconButton from '$lib/button/IconButton.svelte';

	interface InputProps extends Omit<HTMLInputAttributes & HTMLTextareaAttributes, 'value'> {
		type?: string;
		value?: string | number;
		placeholder?: string;
		multiline?: boolean;
		id?: string;
		secondary?: boolean;
		primary?: boolean;
		leading?: string | { icon: string } | any;
		trailing?: string | { icon: string } | any;
		onkeyup?: (e: KeyboardEvent) => void;
		onsubmit?: (e: Event) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		multiline = false,
		id: _id,

		secondary = false,
		primary = !secondary,
		leading,
		trailing,

		onkeyup: _onkeyup,
		onsubmit,

		...rest
	}: InputProps = $props();

	let id = $derived(_id || getCounter());
	let onkeyup = $derived(
		_onkeyup || onsubmit
			? (e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						if (onsubmit) onsubmit(e);
						else (e.target as HTMLElement).blur();
					}
					if (_onkeyup) _onkeyup(e);
				}
			: null
	);
</script>

{#snippet additional(target: any, trailing = false)}
	<span class:trailing>
		{#if typeof target === 'string'}
			<Icon icon={target} class="leading" />
		{:else if target?.icon}
			<IconButton {...target} />
		{:else}
			<Render it={target} />
		{/if}
	</span>
{/snippet}

<main class:primary class:secondary>
	{@render additional(leading)}
	<div class="background"></div>
	<div>
		{#if multiline}
			<textarea {id} bind:value placeholder="&nbsp;" {...rest} {onkeyup}></textarea>
		{:else}
			<input {id} {type} bind:value placeholder="&nbsp;" {...rest} {onkeyup} />
		{/if}
		{#if placeholder}
			<label for={id}>{placeholder}</label>
		{/if}
	</div>
	{@render additional(trailing, true)}
</main>

<style lang="scss">
	span {
		vertical-align: 10%;
		position: relative;
		z-index: 1;
		margin: 0 -0.4em 0 0.6em;

		--on-theme: var(--theme);

		&.trailing {
			margin: 0 0.6em 0 -0.4em;
		}

		:global(span) {
			vertical-align: unset;
		}
	}

	main {
		position: relative;
		display: inline-block;
		background: var(--theme-light1);
		border-bottom: 1px solid var(--theme-light4);
		border-radius: 4px 4px 0 0;
	}

	input,
	textarea {
		-webkit-appearance: none;
		appearance: none;
		color: var(--on-surface);
		background: transparent;
		outline: none;
		border: none;
		padding: 1.6em 1em 0.6em;
		border-radius: 4px 4px 0 0;
		position: relative;
		z-index: 1;
	}

	.background {
		background: var(--theme-light2);
		border-bottom: 1px solid var(--theme);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px 4px 0 0;
		opacity: 0;
		transform: scaleX(0);
		transform-origin: left;
		transition:
			opacity 0.2s ease,
			transform 0.2s cubic-bezier(1, 0, 1, 0);

		&:has(+ div > *:focus) {
			opacity: 1;
			transform: scaleX(1);
			transition: all 0.2s ease;
		}
	}

	div {
		position: relative;
		display: inline-block;
	}

	label {
		position: absolute;
		left: 0;
		user-select: none;
		transition: all 0.2s ease;
		transform: translate(0.7em, 0.8em);
		z-index: 1;
		opacity: 0.7;
		color: var(--on-surface);

		*:focus ~ &,
		*:not(:placeholder-shown) ~ & {
			transform: translate(0.7em, 0.26em) scale(0.72);
			transform-origin: 0 0;
		}
	}
</style>
