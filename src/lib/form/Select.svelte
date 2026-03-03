<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '$lib/etc/Icon.svelte';
	import Render from '$lib/etc/Render.svelte';
	import Ripple from '$lib/etc/Ripple.svelte';
	import SelectBody from '$lib/form/SelectBody.svelte';
	import Paper from '$lib/paper/Paper.svelte';
	import { uniqueId, type Renderable } from '$lib/util.svelte.js';

	type SelectValue = string | number | boolean | null;

	export interface SelectOption {
		value: SelectValue;
		label: Renderable;
		subtitle?: Renderable;
		icon?: string;
		disabled?: boolean;
		searchText?: string;
	}

	interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onselect'> {
		id?: string;
		name?: string;
		value?: SelectValue;
		options?: SelectOption[];
		placeholder?: string;
		search?: boolean;
		searchPlaceholder?: string;
		emptyText?: Renderable;
		noResultText?: Renderable;
		show?: boolean;
		disabled?: boolean;
		block?: boolean;
		secondary?: boolean;
		primary?: boolean;
		mobile?: boolean;
		remap?: boolean;
		maxHeight?: string;
		onselect?: (option: SelectOption) => void;
		snippet?: Snippet<[SelectOption | undefined, SelectValue | undefined]> | null;
		triggerSnippet?: Snippet<[SelectOption | undefined, SelectValue | undefined, boolean]> | null;
	}

	const isTextLabel = (label: Renderable): label is string | number =>
		typeof label === 'string' || typeof label === 'number';
	const selectAutomove = {
		threshold: 180
	} as const;

	let {
		id: _id,
		name,
		value = $bindable<SelectValue | undefined>(undefined),
		options = [],
		placeholder = '',
		search = false,
		searchPlaceholder = 'Search',
		emptyText = 'No options',
		noResultText = 'No matching options',
		show = $bindable(false),
		disabled = false,
		block,
		secondary,
		primary = !secondary,
		mobile,
		remap = false,
		maxHeight = '320px',
		onselect,
		snippet = null,
		triggerSnippet = null,
		...rest
	}: SelectProps = $props();

	let id = $derived(_id || uniqueId('select'));
	let hiddenValue = $derived(value === undefined || value === null ? '' : String(value));
	let selectedOption = $derived(options.find((option) => option.value === value));
	let hasCustomDisplay = $derived(snippet !== null && snippet !== undefined);
	let hasCustomTrigger = $derived(triggerSnippet !== null && triggerSnippet !== undefined);
	let selectedText = $derived.by(() => {
		if (!selectedOption || !isTextLabel(selectedOption.label)) return '';
		return String(selectedOption.label);
	});
	let useOverlayValue = $derived(
		!!selectedOption && (hasCustomDisplay || !isTextLabel(selectedOption.label))
	);
	let inputDisplayValue = $derived(useOverlayValue ? '' : selectedText);
	let hasVisibleValue = $derived(!!selectedOption);
	let isFloating = $derived(show || hasVisibleValue);

	let panelMinWidth = $state('220px');
	let trigger = $state<HTMLDivElement | null>(null);

	const selectOption = (option: SelectOption) => {
		if (option.disabled) return;
		value = option.value;
		show = false;
		onselect?.(option);
	};

	$effect(() => {
		const node = trigger;
		if (!node) return;
		const update = () => {
			const width = node.getBoundingClientRect().width;
			if (width) panelMinWidth = `${width}px`;
			const valueInput = node.querySelector<HTMLInputElement>('.value-input');
			if (!valueInput) return;
			const valueInputStyle = getComputedStyle(valueInput);
			node.style.setProperty('--select-value-font-family', valueInputStyle.fontFamily);
			node.style.setProperty('--select-value-font-size', valueInputStyle.fontSize);
			node.style.setProperty('--select-value-line-height', valueInputStyle.lineHeight);
		};

		update();
		if (typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(update);
		observer.observe(node);
		return () => observer.disconnect();
	});
</script>

{#snippet field()}
	<div
		class="field"
		class:open={show}
		class:disabled
		class:filled={isFloating}
		style:--ripple-color="var(--primary)"
		bind:this={trigger}
		aria-haspopup="listbox"
		aria-controls={`${id}-panel`}
		aria-disabled={disabled}
	>
		<div class="background"></div>
		<div class="text">
			<input
				class="value-input"
				type="text"
				placeholder="&nbsp;"
				value={inputDisplayValue}
				readonly
				tabindex="-1"
				aria-hidden="true"
			/>
			{#if useOverlayValue}
				<div class="value">
					{#if hasCustomDisplay}
						{@render snippet?.(selectedOption, value)}
					{:else if selectedOption}
						<Render it={selectedOption.label} />
					{/if}
				</div>
			{/if}
			{#if placeholder}
				<span class="floating">{placeholder}</span>
			{/if}
		</div>
		<Icon class={show ? 'arrow flip' : 'arrow'} icon="arrow_drop_down" />
		<Ripple active={show} />
	</div>
{/snippet}

{#snippet customTrigger()}
	<div
		class="custom-trigger"
		class:open={show}
		class:disabled
		bind:this={trigger}
		aria-haspopup="listbox"
		aria-controls={`${id}-panel`}
		aria-disabled={disabled}
	>
		{@render triggerSnippet?.(selectedOption, value, show)}
	</div>
{/snippet}

{#snippet triggerField()}
	{#if hasCustomTrigger}
		{@render customTrigger()}
	{:else}
		{@render field()}
	{/if}
{/snippet}

<div class="root" class:block class:_p={primary} class:_s={secondary} {...rest}>
	{#if name}
		<input type="hidden" {name} value={hiddenValue} {disabled} />
	{/if}

	{#if disabled}
		{@render triggerField()}
		{:else}
			<Paper bl dense bind:show {block} {mobile} {remap} automove={selectAutomove}>
			{#snippet target()}
				{@render triggerField()}
			{/snippet}

			<SelectBody
				id={`${id}-panel`}
				{options}
				{search}
				{searchPlaceholder}
				{emptyText}
				{noResultText}
				minWidth={panelMinWidth}
				{maxHeight}
				open={show}
				ariaLabel={placeholder || 'Select options'}
				bind:value
				onselect={selectOption}
				onclose={() => (show = false)}
			/>
		</Paper>
	{/if}
</div>

<style>
	.root {
		--select-min-width: 220px;
		display: inline-block;
		min-width: var(--select-min-width);
		max-width: 100%;
		width: max-content;
	}

	.root.block {
		display: block;
		width: 100%;
	}

	.root.block,
	.root.block :global(.trigger),
	.root.block .field {
		min-width: 0;
	}

	.root :global(.trigger) {
		display: block;
		width: 100%;
		min-width: var(--select-min-width);
	}

	.custom-trigger {
		display: block;
		width: 100%;
		min-width: var(--select-min-width);
	}

	.custom-trigger.disabled {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}

	.field {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 100%;
		min-width: var(--select-min-width);
		background: var(--theme-light1);
		border-bottom: 1px solid var(--theme-light4);
		border-radius: 4px 4px 0 0;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.field.disabled {
		cursor: not-allowed;
		opacity: 0.6;
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
	}

	.field.open .background {
		opacity: 1;
		transform: scaleX(1);
		transition: all 0.2s ease;
	}

	.text {
		position: relative;
		display: inline-block;
		flex: 1;
		min-width: 0;
	}

	.value-input {
		-webkit-appearance: none;
		appearance: none;
		color: var(--on-surface);
		caret-color: transparent;
		background: transparent;
		outline: none;
		border: none;
		padding: 1.6em 1em 0.6em;
		border-radius: 4px 4px 0 0;
		position: relative;
		z-index: 1;
		width: calc(100% - 2em);
		pointer-events: none;
		user-select: none;
	}

	.value {
		position: absolute;
		inset: 0;
		min-width: 0;
		color: var(--on-surface);
		font-family: var(--select-value-font-family, Arial);
		font-size: var(--select-value-font-size, 13.3333px);
		line-height: var(--select-value-line-height, normal);
		padding: 1.6em 1em 0.6em;
		border-radius: 4px 4px 0 0;
		z-index: 2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		pointer-events: none;
	}

	.value :global(*) {
		min-width: 0;
	}

	.floating {
		position: absolute;
		left: 0;
		user-select: none;
		transition: all 0.2s ease;
		transform: translate(0.7em, 0.8em);
		z-index: 1;
		opacity: 0.7;
		color: var(--on-surface);
		pointer-events: none;
	}

	.field.filled .floating,
	.field.open .floating {
		transform: translate(0.7em, 0.26em) scale(0.72);
		transform-origin: 0 0;
	}

	.arrow {
		margin: 0 0.6em 0 -0.4em;
		color: var(--on-surface);
		opacity: 0.85;
		transition: transform 0.2s ease;
		transform: translateY(10%) rotate(0deg);
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}

	.arrow.flip {
		transform: translateY(10%) rotate(180deg);
	}

	.root :global(.trigger:focus-visible) {
		outline: none;
	}
</style>
