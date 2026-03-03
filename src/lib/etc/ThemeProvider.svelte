<script lang="ts">
	import { setContext } from 'svelte';
	import { Render } from '$lib/index.js';
	import SnackbarContainer from '$lib/notify/SnackbarContainer.svelte';
	import DialogContainer from '$lib/notify/DialogContainer.svelte';
	import type { Renderable } from '$lib/util.svelte.js';
	import './base.css';

	interface ThemeProviderProps {
		children?: Renderable;
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

	const rootStyleText = $derived(
		`<style>:root{--theme:${primary};--primary:${primary};--secondary:${secondary};--surface:${surface};--on-primary:${onPrimary};--on-theme:${primary};--on-secondary:${onSecondary};--on-surface:${onSurface};}</style>`
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		let raf1 = 0;
		let raf2 = 0;
		raf1 = window.requestAnimationFrame(() => {
			raf2 = window.requestAnimationFrame(() => {
				document.querySelectorAll('#nunui-ripple-has-fallback').forEach((node) => node.remove());
			});
		});

		return () => {
			if (raf1) window.cancelAnimationFrame(raf1);
			if (raf2) window.cancelAnimationFrame(raf2);
		};
	});

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
	{@html rootStyleText}
	<style id="nunui-ripple-has-fallback">
		*:has(> ._r) {
			position: relative;
			overflow: hidden;
		}

		*:has(> ._r):hover > .h {
			opacity: var(--opacity, 0.2);
		}
	</style>
</svelte:head>

<Render {children} />
<SnackbarContainer />
<DialogContainer />
