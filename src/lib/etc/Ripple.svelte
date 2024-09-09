<script lang="ts">
	import { flushSync } from 'svelte';
	import { on } from 'svelte/events';
	import { delayedToggle } from '$lib/util.svelte.js';

	interface RippleProps {
		center?: boolean;
		extra?: HTMLElement;
		active?: boolean;
		clicked?: boolean;
		hover?: boolean;
		primary?: boolean;
		secondary?: boolean;
	}

	const duration = 400;
	let {
		center,
		extra,
		active: _active,
		clicked = $bindable(false),
		hover = $bindable(false),
		primary,
		secondary
	}: RippleProps = $props();

	let x = $state(0),
		y = $state(0),
		size = $state(0);
	let show = $state(false),
		back = delayedToggle(false, 0),
		active = delayedToggle(_active, 0);
	let render = delayedToggle(false, duration, duration);
	let adapter: HTMLElement | null = null,
		startTs = 0;
	let iv = 0,
		run = 0;

	let container = $derived(extra || (adapter as any as HTMLElement)?.parentElement);

	$effect(() => {
		active.v = _active as any;
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
		show = render.r = false;
		({ x, y, size } = rippleSize(targetX, targetY));
		startTs = Date.now();
		flushSync();
		show = render.r = true;
	};

	const showBackground = () => (back.v = true);
	const showRippleMouse = ({ pageX, pageY }: MouseEvent) => rippleShowEvent(pageX, pageY);
	const hideRipple = () => {
		if (iv) clearTimeout(iv);
		if (run) run--;
		iv = setTimeout(() => (show = false), Math.max(0, duration - (Date.now() - startTs)));
	};

	const exitRipple = () => {
		back.v = false;
		hideRipple();
	};

	const showRippleTouch = (e: TouchEvent) => {
		rippleShowEvent(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		run++;
	};

	$effect(() => {
		if (!container) return;
		const handlers = [
			on(container, 'mousemove', showBackground),
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

<main bind:this={adapter} class:show class:primary class:secondary class="__rp">
	{#if render.v}
		<div style:left="{x}px" style:top="{y}px" style:--size="{size}px"></div>
	{/if}
</main>

{#if back.v}
	<span class:exit={!back.r} class:center></span>
{/if}
{#if active.v}
	<span class:exit={!active.r} class:center></span>
{/if}

<style lang="scss">
	* {
		pointer-events: none;
	}

	:global(*):has(> .__rp) {
		position: relative;
		overflow: hidden;
	}

	.center {
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

		&.show {
			opacity: var(--opacity, 0.3);
		}
	}

	div {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--size, 100%);
		height: var(--size, 100%);
		background: var(--on-theme);
		transform: translate(-50%, -50%);
		border-radius: 100%;

		transition: background-color 0.2s ease;
		animation: scaleIn var(--dur, 600ms) cubic-bezier(0, 0.57, 0.1, 0.98) forwards;
	}

	span {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--on-theme);
		opacity: var(--opacity, 0.2);
		animation: fadeIn var(--dur, 200ms) ease forwards;

		&.exit {
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
