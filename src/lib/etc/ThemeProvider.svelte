<script lang="ts">
	import { flushSync, setContext, tick } from 'svelte';
	import { Render } from '$lib/index.js';
	import SnackbarContainer from '$lib/notify/SnackbarContainer.svelte';
	import DialogContainer from '$lib/notify/DialogContainer.svelte';
	import './base.css';

	interface ThemeProviderProps {
		children?: any;
		primary?: string;
		secondary?: string;
		surface?: string;
		onPrimary?: string;
		onSecondary?: string;
		onSurface?: string;
		mobile?: boolean;
		local?: boolean;
		vibrate?: boolean;
	}

	let {
		children,
		primary = '#6200EE',
		secondary = '#03DAC6',
		surface = '#FFFFFF',
		onPrimary = '#FFFFFF',
		onSecondary = '#000000',
		onSurface = '#000000',
		mobile = false,
		vibrate = true
	}: ThemeProviderProps = $props();

	const style = $derived(
		`<style>:root{--theme:${primary};--primary:${primary};--secondary:${secondary};--surface:${surface};--on-primary:${onPrimary};--on-theme:${primary};--on-secondary:${onSecondary};--on-surface:${onSurface};}</style>`
	);

	setContext('config', {
		get mobile() {
			return mobile;
		},
		get vibrate() {
			return vibrate;
		}
	});
</script>

<svelte:head>
	{@html style}
</svelte:head>

<Render {children} />
<SnackbarContainer />
<DialogContainer />
