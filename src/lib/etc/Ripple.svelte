<script lang="ts">
	import { flushSync, getContext } from 'svelte';
	import { on } from 'svelte/events';
	import { delayedToggle } from '$lib/util.svelte.js';

	interface RippleProps {
		center?: boolean;
		extra?: HTMLElement;
		active?: boolean;
		clicked?: boolean;
		primary?: boolean;
		secondary?: boolean;
		onclick?: (e: MouseEvent) => unknown;
	}

	const duration = 400;
	let {
		center,
		extra,
		active: _active,
		clicked = $bindable(false),
		primary,
		secondary,
		onclick
	}: RippleProps = $props();

	const config = getContext<{ vibrate: boolean }>('config');

	let x = $state(0),
		y = $state(0),
		size = $state(0);
	let show = $state(false),
		active = delayedToggle(false, 0);
	let render = delayedToggle(false, duration, duration);
	let adapter: HTMLElement | null = null,
		startTs = 0;
	let iv = 0,
		run = 0;

	let container = $derived(extra || (adapter as HTMLElement | null)?.parentElement);

	$effect(() => {
		active.v = !!_active;
	});

	$effect(() => {
		render.v = show;
	});

	const rippleSize = (targetX: number, targetY: number) => {
		if (!adapter || !adapter.parentElement) return { x: 0, y: 0, size: 0 };
		const r = adapter.parentElement.getBoundingClientRect();
		const w = r.width,
			h = r.height,
			t = r.top,
			l = r.left;
		if (!center) {
			const x = targetX - l - window.scrollX,
				y = targetY - t - window.scrollY;
			const _x = Math.max(x, w - x),
				_y = Math.max(y, h - y);
			const size = Math.sqrt(_x * _x + _y * _y) * 2;
			return { x, y, size };
		} else return { x: w / 2, y: h / 2, size: Math.max(w, h) };
	};

	const rippleShowEvent = (targetX: number, targetY: number) => {
		if (run) return (run = 1);
		run = 1;
		if (iv) clearTimeout(iv);
		if (config?.vibrate && typeof navigator.vibrate === 'function') navigator.vibrate(5);
		show = render.r = false;
		({ x, y, size } = rippleSize(targetX, targetY));
		startTs = Date.now();
		flushSync();
		show = render.r = true;
	};

	const showRippleMouse = ({ pageX, pageY }: MouseEvent) => {
		clicked = true;
		rippleShowEvent(pageX, pageY);
	};
	const hideRipple = () => {
		clicked = false;
		if (iv) clearTimeout(iv);
		if (run) run--;
		iv = setTimeout(() => (show = false), Math.max(0, duration - (Date.now() - startTs)));
	};

	const exitRipple = () => {
		clicked = false;
		hideRipple();
	};

	const showRippleTouch = (e: TouchEvent) => {
		clicked = true;
		rippleShowEvent(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		run++;
	};

	$effect(() => {
		if (!container) return;
		const handlers = [
			on(container, 'mousedown', showRippleMouse),
			on(container, 'mouseup', hideRipple),
			on(container, 'mouseleave', exitRipple),
			on(container, 'touchstart', showRippleTouch),
			on(container, 'touchend', hideRipple),
			on(container, 'touchcancel', exitRipple)
		];

		return () => handlers.forEach((h) => h());
	});
</script>

<main
	bind:this={adapter}
	class:s={show}
	class:_p={primary}
	class:_s={secondary}
	class="_r"
	data-clicked={clicked ? 'true' : 'false'}
	{onclick}
	role="presentation"
>
	{#if render.v}
		<div style:left="{x}px" style:top="{y}px" style:--size="{size}px"></div>
	{/if}
</main>

<span class="h" class:c={center}></span>
{#if active.v}
	<span class="a" class:e={!active.r} class:c={center}></span>
{/if}

<style>
	* {
		pointer-events: none;
	}

	:global(*:has(> ._r)) {
		position: relative;
		overflow: hidden;
	}

	.c {
		border-radius: 100px;
	}

	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: opacity 0.2s ease;
		opacity: 0;

		&.s {
			opacity: var(--opacity, 0.3);
		}
	}

	div {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--size, 100%);
		height: var(--size, 100%);
		background: var(--ripple-color, var(--on-theme));
		transform: translate(-50%, -50%);
		border-radius: 100%;

		transition: background-color 0.2s ease;
		animation: scaleIn var(--dur, 600ms) cubic-bezier(0, 0.57, 0.1, 0.98) forwards;
	}

	.h,
	.a {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--ripple-color, var(--on-theme));
	}

	.h {
		opacity: 0;
		transition: opacity var(--dur, 200ms) ease;
	}

	:global(*:has(> ._r):hover) > .h {
		opacity: var(--opacity, 0.2);
	}

	.a {
		opacity: var(--opacity, 0.2);
		animation: fadeIn var(--dur, 200ms) ease forwards;

		&.e {
			animation: fadeOut var(--dur, 200ms) ease forwards;
		}
	}

	@keyframes scaleIn {
		0% {
			transform: translate(-50%, -50%) scale(var(--i-sc, 0));
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: var(--opacity, 0.2);
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: var(--opacity, 0.2);
		}
		100% {
			opacity: 0;
		}
	}
</style>
