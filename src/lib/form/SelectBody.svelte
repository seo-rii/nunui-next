<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tick } from 'svelte';
	import Icon from '$lib/etc/Icon.svelte';
	import Render from '$lib/etc/Render.svelte';
	import SelectSearch from '$lib/form/SelectSearch.svelte';
	import List from '$lib/list/List.svelte';
	import OneLine from '$lib/list/OneLine.svelte';
	import TwoLine from '$lib/list/TwoLine.svelte';
	import type { SelectOption } from '$lib/form/Select.svelte';
	import type { Renderable } from '$lib/util.svelte.js';

	type SelectValue = string | number | boolean | null;

	interface SelectBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onselect'> {
		id?: string;
		value?: SelectValue;
		options?: SelectOption[];
		search?: boolean;
		searchPlaceholder?: string;
		emptyText?: Renderable;
		noResultText?: Renderable;
		minWidth?: string;
		maxHeight?: string;
		open?: boolean;
		autofocus?: boolean;
		ariaLabel?: string;
		query?: string;
		input?: HTMLInputElement | HTMLTextAreaElement;
		onselect?: (option: SelectOption) => void;
		onclose?: () => void;
	}

	const isTextLabel = (label: Renderable): label is string | number =>
		typeof label === 'string' || typeof label === 'number';

	let {
		id,
		value = $bindable<SelectValue | undefined>(undefined),
		options = [],
		search = false,
		searchPlaceholder = 'Search',
		emptyText = 'No options',
		noResultText = 'No matching options',
		minWidth = '220px',
		maxHeight = '320px',
		open = true,
		autofocus = true,
		ariaLabel = 'Select options',
		query = $bindable(''),
		input = $bindable<HTMLInputElement | HTMLTextAreaElement>(),
		onselect,
		onclose,
		...rest
	}: SelectBodyProps = $props();

	let activeIndex = $state(-1);
	let panelElement = $state<HTMLDivElement | null>(null);

	const normalizeText = (text: unknown) =>
		String(text ?? '')
			.toLocaleLowerCase()
			.trim();
	const toSearchText = (option: SelectOption) =>
		option.searchText !== undefined
			? option.searchText
			: isTextLabel(option.label)
				? String(option.label)
				: String(option.value ?? '');

	let filteredOptions = $derived.by(() => {
		const q = normalizeText(query);
		if (!search || !q) return options;
		return options.filter((option) => normalizeText(toSearchText(option)).includes(q));
	});

	const firstEnabledIndex = (items: SelectOption[]) =>
		items.findIndex((option) => !option.disabled);
	const lastEnabledIndex = (items: SelectOption[]) => {
		for (let i = items.length - 1; i >= 0; i -= 1) {
			if (!items[i]?.disabled) return i;
		}
		return -1;
	};
	const findAdjacentEnabledIndex = (start: number, step: number, items: SelectOption[]) => {
		if (!items.length) return -1;
		let index = start;
		for (let i = 0; i < items.length; i += 1) {
			index = (index + step + items.length) % items.length;
			if (!items[index]?.disabled) return index;
		}
		return -1;
	};
	const optionClassName = (option: SelectOption, index: number) =>
		`option${index === activeIndex ? ' active' : ''}${option.value === value ? ' selected' : ''}${
			option.disabled ? ' disabled' : ''
		}`;
	let focusableOptionIndex = $derived.by(() =>
		activeIndex >= 0 ? activeIndex : firstEnabledIndex(filteredOptions)
	);

	const focusOption = (index: number) => {
		const node = panelElement?.querySelector<HTMLElement>(`[data-option-index="${index}"]`);
		node?.focus();
	};

	const moveActive = (step: number) => {
		const items = filteredOptions;
		if (!items.length) return;

		if (activeIndex < 0) {
			const first = step > 0 ? firstEnabledIndex(items) : lastEnabledIndex(items);
			if (first >= 0) {
				activeIndex = first;
				focusOption(first);
			}
			return;
		}

		const next = findAdjacentEnabledIndex(activeIndex, step, items);
		if (next >= 0) {
			activeIndex = next;
			focusOption(next);
		}
	};

	const selectOption = (option: SelectOption) => {
		if (option.disabled) return;
		value = option.value;
		onselect?.(option);
	};

	const handleSearchKeydown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			moveActive(1);
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			moveActive(-1);
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			onclose?.();
		}
	};

	const handleOptionKeydown = (e: KeyboardEvent, index: number, option: SelectOption) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			moveActive(1);
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			moveActive(-1);
			return;
		}
		if (e.key === 'Home') {
			e.preventDefault();
			const first = firstEnabledIndex(filteredOptions);
			if (first >= 0) {
				activeIndex = first;
				focusOption(first);
			}
			return;
		}
		if (e.key === 'End') {
			e.preventDefault();
			const last = lastEnabledIndex(filteredOptions);
			if (last >= 0) {
				activeIndex = last;
				focusOption(last);
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			onclose?.();
			return;
		}
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			selectOption(option);
			return;
		}
		activeIndex = index;
	};

	$effect(() => {
		if (open) return;
		query = '';
		activeIndex = -1;
	});

	$effect(() => {
		if (!open) return;
		const items = filteredOptions;
		if (!items.length) {
			activeIndex = -1;
			return;
		}

		const selectedIndex = items.findIndex((option) => option.value === value && !option.disabled);
		if (selectedIndex >= 0) {
			activeIndex = selectedIndex;
			return;
		}

		if (activeIndex >= 0 && activeIndex < items.length && !items[activeIndex]?.disabled) return;
		activeIndex = -1;
	});

	$effect(() => {
		if (!open || !autofocus) return;
		let canceled = false;
		tick().then(() => {
			if (canceled || !open) return;
			if (search && input) {
				input.focus();
				input.select?.();
				return;
			}
			if (activeIndex >= 0) focusOption(activeIndex);
		});
		return () => {
			canceled = true;
		};
	});
</script>

<div
	{id}
	class="panel"
	style:min-width={minWidth}
	style:max-height={maxHeight}
	bind:this={panelElement}
	role="listbox"
	aria-label={ariaLabel}
	{...rest}
>
	{#if search}
		<SelectSearch
			sticky
			placeholder={searchPlaceholder}
			bind:value={query}
			bind:input
			onkeydown={handleSearchKeydown}
		/>
	{/if}

	<List class="options">
		{#if filteredOptions.length}
			{#each filteredOptions as option, index (`${option.value}-${index}`)}
				{#if option.subtitle}
					<TwoLine
						class={optionClassName(option, index)}
						rippleColor="var(--primary)"
						role="option"
						aria-selected={option.value === value}
						aria-disabled={option.disabled}
						tabindex={option.disabled ? -1 : index === focusableOptionIndex ? 0 : -1}
						data-option-index={index}
						icon={option.icon}
						title={option.label}
						subtitle={option.subtitle}
						trailingIcon={option.value === value ? 'check' : undefined}
						active={index === activeIndex || option.value === value}
						onclick={option.disabled ? undefined : () => selectOption(option)}
						onmouseenter={() => {
							if (!option.disabled) activeIndex = index;
						}}
						onfocus={() => {
							if (!option.disabled) activeIndex = index;
						}}
						onkeydown={(e) => handleOptionKeydown(e, index, option)}
					/>
				{:else}
					<OneLine
						class={optionClassName(option, index)}
						rippleColor="var(--primary)"
						role="option"
						aria-selected={option.value === value}
						aria-disabled={option.disabled}
						tabindex={option.disabled ? -1 : index === focusableOptionIndex ? 0 : -1}
						data-option-index={index}
						icon={option.icon}
						title={option.label}
						trailingIcon={option.value === value ? 'check' : undefined}
						active={index === activeIndex || option.value === value}
						onclick={option.disabled ? undefined : () => selectOption(option)}
						onmouseenter={() => {
							if (!option.disabled) activeIndex = index;
						}}
						onfocus={() => {
							if (!option.disabled) activeIndex = index;
						}}
						onkeydown={(e) => handleOptionKeydown(e, index, option)}
					/>
				{/if}
			{/each}
		{:else}
			<div class="empty">
				<Icon icon={search && query ? 'search_off' : 'list'} />
				<div>
					{#if search && query}
						<Render it={noResultText} />
					{:else}
						<Render it={emptyText} />
					{/if}
				</div>
			</div>
		{/if}
	</List>
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 100%;
	}

	.options {
		padding: 4px 0;
		overflow: auto;
	}

	.options :global(.item.option) {
		margin: 2px 4px;
		padding: 10px 12px;
		border-radius: 8px;
		gap: 10px;
		color: var(--on-surface);
		outline: none;
		transition: background-color 0.15s ease;
	}

	.options :global(.item.option:hover),
	.options :global(.item.option.active),
	.options :global(.item.option:focus-visible) {
		background: color-mix(in srgb, var(--on-surface), transparent 92%);
	}

	.options :global(.item.option.selected) {
		background: color-mix(in srgb, var(--on-surface), transparent 88%);
	}

	.options :global(.item.option.disabled) {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.options :global(.item.option .option-check) {
		opacity: 0.88;
	}

	.options :global(.item.option .subtitle) {
		opacity: 0.72;
	}

	.empty {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 16px 12px;
		color: color-mix(in srgb, var(--on-surface), transparent 28%);
	}
</style>
