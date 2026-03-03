<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/etc/Icon.svelte';
	import Render from '$lib/etc/Render.svelte';
	import Ripple from '$lib/etc/Ripple.svelte';
	import { classes, type Renderable } from '$lib/util.svelte.js';

	export type SegmentButtonValue = string | number | boolean;
	export type SegmentButtonVariant = 'm3' | 'm3e';

	export interface SegmentButtonOption {
		value: SegmentButtonValue;
		label: Renderable;
		icon?: string;
		disabled?: boolean;
	}

	interface SegmentButtonProps extends Omit<
		HTMLAttributes<HTMLDivElement>,
		'children' | 'onselect'
	> {
		options?: SegmentButtonOption[];
		value?: SegmentButtonValue;
		values?: SegmentButtonValue[];
		multiple?: boolean;
		disabled?: boolean;
		full?: boolean;
		small?: boolean;
		showCheck?: boolean;
		secondary?: boolean;
		primary?: boolean;
		variant?: SegmentButtonVariant;
		onselect?: (
			option: SegmentButtonOption,
			selected: boolean,
			values: SegmentButtonValue[]
		) => void;
	}

	let {
		options = [],
		value = $bindable<SegmentButtonValue | undefined>(undefined),
		values = $bindable<SegmentButtonValue[]>([]),
		multiple = false,
		disabled = false,
		full = false,
		small = false,
		showCheck = true,
		secondary,
		primary = !secondary,
		variant = 'm3e',
		onselect,
		class: className,
		...rest
	}: SegmentButtonProps = $props();

	let buttons = $state<(HTMLButtonElement | null)[]>([]);
	let hasSelectedOption = $derived(options.some((option) => option.value === value));
	let firstEnabledIndex = $derived(disabled ? -1 : options.findIndex((option) => !option.disabled));
	let wrapperClass = $derived(
		classes(className as string, {
			_p: primary,
			_s: secondary,
			f: full,
			sm: small,
			m3: variant === 'm3',
			m3e: variant === 'm3e'
		})
	);
</script>

<div
	{...rest}
	class={wrapperClass}
	role={multiple ? 'group' : 'radiogroup'}
	aria-disabled={disabled}
	aria-multiselectable={multiple ? 'true' : undefined}
>
	{#each options as option, index (`${String(option.value)}-${index}`)}
		{@const selected = multiple ? values.some((v) => v === option.value) : option.value === value}
		{@const optionDisabled = disabled || !!option.disabled}
		<button
			bind:this={buttons[index]}
			type="button"
			class="segment"
			class:start={index === 0}
			class:middle={index > 0 && index < options.length - 1}
			class:end={index === options.length - 1}
			class:selected
			disabled={optionDisabled}
			role={multiple ? undefined : 'radio'}
			aria-checked={multiple ? undefined : selected}
			aria-pressed={multiple ? selected : undefined}
			tabindex={optionDisabled
				? -1
				: multiple
					? 0
					: selected || (!hasSelectedOption && index === firstEnabledIndex)
						? 0
						: -1}
			onclick={() => {
				if (optionDisabled) return;
				if (multiple) {
					const exists = values.some((v) => v === option.value);
					if (exists) values = values.filter((v) => v !== option.value);
					else values = [...values, option.value];
					onselect?.(option, !exists, values);
					return;
				}
				value = option.value;
				onselect?.(option, true, [option.value]);
			}}
			onkeydown={(e) => {
				if (
					e.key !== 'ArrowRight' &&
					e.key !== 'ArrowLeft' &&
					e.key !== 'ArrowUp' &&
					e.key !== 'ArrowDown' &&
					e.key !== 'Home' &&
					e.key !== 'End'
				) {
					return;
				}
				e.preventDefault();
				if (!options.length || disabled) return;

				let next = index;
				if (e.key === 'Home') {
					next = -1;
					for (let i = 0; i < options.length; i += 1) {
						next = (next + 1 + options.length) % options.length;
						if (options[next]?.disabled) continue;
						buttons[next]?.focus();
						if (multiple) return;
						value = options[next]?.value;
						if (options[next]) onselect?.(options[next], true, [options[next].value]);
						return;
					}
					return;
				}

				if (e.key === 'End') {
					next = 0;
					for (let i = 0; i < options.length; i += 1) {
						next = (next - 1 + options.length) % options.length;
						if (options[next]?.disabled) continue;
						buttons[next]?.focus();
						if (multiple) return;
						value = options[next]?.value;
						if (options[next]) onselect?.(options[next], true, [options[next].value]);
						return;
					}
					return;
				}

				const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
				for (let i = 0; i < options.length; i += 1) {
					next = (next + step + options.length) % options.length;
					if (options[next]?.disabled) continue;
					buttons[next]?.focus();
					if (multiple) return;
					value = options[next]?.value;
					if (options[next]) onselect?.(options[next], true, [options[next].value]);
					return;
				}
			}}
		>
			{#if (showCheck && selected) || option.icon}
				<span class="icon">
					{#if showCheck && selected}
						<Icon icon="check" />
					{:else if option.icon}
						<Icon icon={option.icon} />
					{/if}
				</span>
			{/if}
			<span class="label"><Render it={option.label} /></span>
			{#if !optionDisabled}
				<Ripple />
			{/if}
		</button>
	{/each}
</div>

<style>
	div {
		display: inline-flex;
		align-items: stretch;
		gap: 2px;
		max-width: 100%;
	}

	div.f {
		display: flex;
		width: 100%;
	}

	.segment {
		-webkit-appearance: none;
		appearance: none;
		border: 1px solid color-mix(in srgb, var(--on-surface), var(--surface) 68%);
		background: transparent;
		color: var(--on-surface);
		min-height: 40px;
		padding: 0 16px;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25rem;
		letter-spacing: 0.1px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		white-space: nowrap;
		transition:
			border-radius 0.22s ease,
			background-color 0.18s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			transform 0.15s ease;
	}

	div.f .segment {
		flex: 1 1 0;
	}

	div.sm .segment {
		min-height: 28px;
		padding: 0 10px;
		font-size: 0.75rem;
		line-height: 0.95rem;
		gap: 4px;
	}

	.segment .icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
	}

	.segment .icon :global(*) {
		font-size: 18px;
		line-height: 18px;
	}

	div.sm .segment .icon {
		width: 14px;
		height: 14px;
	}

	div.sm .segment .icon :global(*) {
		font-size: 14px;
		line-height: 14px;
	}

	.segment:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--theme), transparent 40%);
		outline-offset: 2px;
		z-index: 2;
	}

	.segment:hover:not(:disabled) {
		background: color-mix(in srgb, var(--theme), transparent 92%);
	}

	.segment:active:not(:disabled) {
		background: color-mix(in srgb, var(--theme), transparent 88%);
	}

	.segment.selected {
		background: var(--theme-light4);
		border-color: transparent;
	}

	.segment:disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}

	div.m3e .segment.start {
		border-radius: 999px 12px 12px 999px;
	}

	div.m3e .segment.middle {
		border-radius: 12px;
	}

	div.m3e .segment.end {
		border-radius: 12px 999px 999px 12px;
	}

	div.m3e .segment.selected {
		border-radius: 999px;
		box-shadow: 0 1px 2px color-mix(in srgb, var(--on-surface), transparent 85%);
	}

	div.m3e .segment.selected:active:not(:disabled) {
		transform: translateY(1px);
	}

	div.m3 .segment {
		border-radius: 0;
	}

	div.m3 .segment + .segment {
		margin-left: -1px;
	}

	div.m3 .segment.start {
		border-radius: 999px 0 0 999px;
	}

	div.m3 .segment.end {
		border-radius: 0 999px 999px 0;
	}
</style>
