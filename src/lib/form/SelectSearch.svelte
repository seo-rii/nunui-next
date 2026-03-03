<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Input from '$lib/form/Input.svelte';

	interface SelectSearchProps extends Omit<
		HTMLAttributes<HTMLDivElement>,
		'children' | 'onkeydown'
	> {
		value?: string;
		placeholder?: string;
		sticky?: boolean;
		input?: HTMLInputElement | HTMLTextAreaElement;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search',
		sticky = false,
		input = $bindable<HTMLInputElement | HTMLTextAreaElement>(),
		onkeydown,
		...rest
	}: SelectSearchProps = $props();
</script>

<div class="root" class:sticky {...rest}>
	<Input plain block leading="search" {placeholder} bind:value bind:input {onkeydown} />
</div>

<style>
	.root {
		padding: 8px;
		background: var(--surface);
		border-bottom: 1px solid color-mix(in srgb, var(--on-surface), transparent 88%);
	}

	.root.sticky {
		position: sticky;
		top: 0;
		z-index: 1;
	}
</style>
