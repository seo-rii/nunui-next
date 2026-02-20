<script module>
	let counter = 0;

	function getCounter() {
		return `nunui-checkbox-${counter++}`;
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Render, Ripple } from '$lib/index.js';

	interface CheckboxProps extends Omit<HTMLInputAttributes, 'checked'> {
		name?: string;
		secondary?: boolean;
		primary?: boolean;
		label?: string | any;
		id?: string;
		value?: any;
		checked?: boolean;
	}

	let {
		name,
		secondary,
		primary = !secondary,
		label,
		id: _id,
		value,
		checked = $bindable(false),
		...rest
	}: CheckboxProps = $props();

	let id = $derived(_id || getCounter());
	let target = $state<HTMLInputElement | null>(null);
	let container = $state<HTMLElement | null>(null);
</script>

<main
	bind:this={container}
	class:_p={primary}
	class:_s={secondary}
	role="presentation"
	onclick={(e) => {
		if ((e.target as any)?.tagName !== 'INPUT' && (e.target as any)?.tagName !== 'LABEL') return;
		//target?.click();
	}}
>
	<div>
		<Ripple extra={container} center />
		<input {id} type="checkbox" {name} {value} bind:this={target} bind:checked {...rest} />
		<svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
			<rect class="short" height="5.6px" width="2px"></rect>
			<rect class="long" width="10.6px" height="2px"></rect>
		</svg>
	</div>
	{#if label}
		<label for={id}>
			<Render it={label} />
		</label>
	{/if}
</main>

<style>
	@keyframes short-intro {
		0% {
			transform: scaleY(-1) translate(7px, -14px) rotate(45deg) scaleY(0);
		}

		100% {
			transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
		}
	}

	@keyframes long-intro {
		0% {
			transform: scaleY(-1) translate(7px, -14px) rotate(45deg) scaleX(0);
		}

		100% {
			transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
		}
	}

	* {
		cursor: pointer;
	}

	svg {
		position: absolute;
		margin: 6px;
		width: calc(100% - 12px);
		height: calc(100% - 12px);
		pointer-events: none;
		left: 0;
	}

	rect {
		transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
		fill: var(--r-on-theme);
		opacity: 0;
	}

	main {
		display: inline-block;
		--r-on-theme: var(--on-theme);

		& > * {
			--on-theme: var(--theme);
		}
	}

	main input:checked ~ svg > rect {
		opacity: 1;
	}

	main input:checked ~ svg > rect.short {
		animation: short-intro 0.2s;
	}

	main input:checked ~ svg > rect.long {
		animation: long-intro 0.2s;
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
		padding: 0;
		margin: 6px;
		width: calc(100% - 12px);
		height: calc(100% - 12px);
		border-radius: 2px;
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
			border-radius: 2px;
			transition: border-color 0.2s;
		}

		&:after {
			content: '';
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 2px;
			background: var(--theme);
			opacity: 0;
			transition: opacity 0.2s;
		}

		&:checked {
			&:before {
				border-color: var(--theme);
			}

			&:after {
				opacity: 1;
			}
		}
	}
</style>
