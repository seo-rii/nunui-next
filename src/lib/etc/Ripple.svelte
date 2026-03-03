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
	const hostAttr = 'data-nnr';
	const hostCountDataKey = 'nunuiRippleHostCount';
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
		active = delayedToggle(!!_active, 0);
	let render = delayedToggle(false, duration, duration);
	let skipInitialActiveAnimation = $state(!!_active);
	let adapter: HTMLElement | null = null,
		startTs = 0;
	let iv = 0,
		pointerId = -1;

	let container = $derived(extra || (adapter as HTMLElement | null)?.parentElement);

	$effect(() => {
		const next = !!_active;
		if (active.r !== next) active.v = next;
		if (!next && skipInitialActiveAnimation) skipInitialActiveAnimation = false;
	});

	$effect(() => {
		if (render.r !== show) render.v = show;
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
		if (iv) clearTimeout(iv);
		if (config?.vibrate && typeof navigator.vibrate === 'function') navigator.vibrate(5);
		show = render.r = false;
		({ x, y, size } = rippleSize(targetX, targetY));
		startTs = Date.now();
		flushSync();
		show = render.r = true;
	};

	const hideRipple = () => {
		clicked = false;
		if (iv) clearTimeout(iv);
		iv = setTimeout(() => (show = false), Math.max(0, duration - (Date.now() - startTs)));
	};

	const exitRipple = () => {
		clicked = false;
		hideRipple();
	};

	$effect(() => {
		if (!container) return;
		const hadHostAttr = container.hasAttribute(hostAttr);
		const hostCount = Number(container.dataset[hostCountDataKey] || '0') + 1;
		container.dataset[hostCountDataKey] = String(hostCount);
		container.setAttribute(hostAttr, '');
		const node = container;

		const showRipplePointer = (e: PointerEvent) => {
			if (pointerId !== -1 && pointerId !== e.pointerId) return;
			pointerId = e.pointerId;
			clicked = true;
			rippleShowEvent(e.pageX, e.pageY);
			if (e.pointerType !== 'mouse') {
				try {
					node.setPointerCapture(e.pointerId);
				} catch {}
			}
		};

		const hideRipplePointer = (e: PointerEvent) => {
			if (pointerId !== e.pointerId) return;
			pointerId = -1;
			if (node.hasPointerCapture(e.pointerId)) {
				try {
					node.releasePointerCapture(e.pointerId);
				} catch {}
			}
			hideRipple();
		};

		const cancelRipplePointer = (e: PointerEvent) => {
			if (pointerId !== e.pointerId) return;
			pointerId = -1;
			if (node.hasPointerCapture(e.pointerId)) {
				try {
					node.releasePointerCapture(e.pointerId);
				} catch {}
			}
			exitRipple();
		};

		const leaveRipplePointer = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse' || pointerId !== e.pointerId) return;
			pointerId = -1;
			if (node.hasPointerCapture(e.pointerId)) {
				try {
					node.releasePointerCapture(e.pointerId);
				} catch {}
			}
			exitRipple();
		};

		const handlers = [
			on(node, 'pointerdown', showRipplePointer),
			on(node, 'pointerup', hideRipplePointer),
			on(node, 'pointercancel', cancelRipplePointer),
			on(node, 'pointerleave', leaveRipplePointer)
		];

		return () => {
			pointerId = -1;
			handlers.forEach((h) => h());
			const nextHostCount = Number(node.dataset[hostCountDataKey] || '1') - 1;
			if (nextHostCount <= 0) {
				delete node.dataset[hostCountDataKey];
				if (!hadHostAttr) node.removeAttribute(hostAttr);
				return;
			}
			node.dataset[hostCountDataKey] = String(nextHostCount);
		};
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
	<span class="a" class:e={!active.r} class:i={skipInitialActiveAnimation} class:c={center}></span>
{/if}

<style>
	* {
		pointer-events: none;
	}

	:global([data-nnr]) {
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

	:global([data-nnr]:hover) > .h {
		opacity: var(--opacity, 0.2);
	}

	.a {
		opacity: var(--opacity, 0.2);
		animation: fadeIn var(--dur, 200ms) ease forwards;

		&.i {
			animation: none;
		}

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
