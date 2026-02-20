<script module>
	let counter = 0;

	function getCounter() {
		return `nunui-input-${counter++}`;
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
	import { Icon, Render } from '$lib/index.js';
	import IconButton from '$lib/button/IconButton.svelte';
	import autosize from 'autosize';

	const action = (node: HTMLElement) => {
		autosize(node);

		return {
			destroy() {
				autosize.destroy(node);
			}
		};
	};

	action.update = autosize.update;
	action.destroy = autosize.destroy;

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
		input?: HTMLInputElement | HTMLTextAreaElement;
		block?: boolean;
		plain?: boolean;
		autosize?: boolean;
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

		input = $bindable<HTMLInputElement | HTMLTextAreaElement>(),
		block,

		plain = false,
		autosize: _autosize = false,

		...rest
	}: InputProps = $props();

	let id = $derived(_id || getCounter());
	let onkeyup = $derived(
		_onkeyup || onsubmit || type === 'number'
			? (e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						if (onsubmit) onsubmit(e);
						else (e.target as HTMLElement).blur();
					}
					if (_onkeyup) _onkeyup(e);
					if (type === 'number') {
						if (typeof value === 'string' && value !== '' && !isNaN(+value)) value = +value;
					}
				}
			: null
	);

	$effect(() => {});
</script>

{#snippet additional(target: any, trailing = false)}
	{#if target}
		<span class:trailing>
			{#if typeof target === 'string'}
				<Icon icon={target} class="leading" />
			{:else if target?.icon}
				<IconButton {...target} />
			{:else}
				<Render it={target} />
			{/if}
		</span>
	{/if}
{/snippet}

<main class:_p={primary} class:_s={secondary} class:block class:plain>
	{@render additional(leading)}
	<div class="background"></div>
	<div>
		{#if multiline}
			{#if _autosize}
				<textarea
					{id}
					bind:value
					placeholder="&nbsp;"
					{...rest}
					{onkeyup}
					bind:this={input}
					use:action
				></textarea>
			{:else}
				<textarea {id} bind:value placeholder="&nbsp;" {...rest} {onkeyup} bind:this={input}
				></textarea>
			{/if}
		{:else}
			<input {id} {type} bind:value placeholder="&nbsp;" {...rest} {onkeyup} bind:this={input} />
		{/if}
		{#if placeholder}
			<label for={id}>{placeholder}</label>
		{/if}
	</div>
	{@render additional(trailing, true)}
</main>

<style>
	span {
		position: relative;
		z-index: 1;
		margin: 0 -0.4em 0 0.6em;
		transform: translateY(10%);

		--on-theme: var(--theme);

		&.trailing {
			margin: 0 0.6em 0 -0.4em;
		}

		& :global(span) {
			vertical-align: unset;
		}
	}

	main {
		position: relative;
		display: inline-flex;
		background: var(--theme-light1);
		border-bottom: 1px solid var(--theme-light4);
		border-radius: 4px 4px 0 0;
		align-items: center;
		transition: box-shadow 0.2s ease;

		&.block {
			display: flex;
		}

		&.plain {
			border-bottom: none;
			border-radius: 6px;
		}

		&:has(:is(input, textarea):focus-visible) {
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme), transparent 55%);
		}
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
		width: calc(100% - 2em);

		&:focus-visible {
			outline: 2px solid var(--theme);
			outline-offset: 2px;
		}
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
		flex: 1;
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
	}

	main.plain :is(input, textarea) {
		border-bottom: none;
		border-radius: 6px;
	}

	main.plain .background {
		border-bottom: none;
		border-radius: 6px;
	}

	main :is(input, textarea):focus ~ label,
	main :is(input, textarea):not(:placeholder-shown) ~ label {
		transform: translate(0.7em, 0.26em) scale(0.72);
		transform-origin: 0 0;
	}
</style>
