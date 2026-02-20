<script lang="ts">
	import { Render } from '$lib/index.js';
	import { getContext } from 'svelte';
	import { on } from 'svelte/events';

	let {
		children,
		show = $bindable(false),
		remap,

		...rest
	} = $props();

	const config = getContext<{ vibrate: boolean }>('config');

	let container = $state<HTMLElement | null>(null);
	let delta = $state(0),
		dx = $state(0);
	let tr = $derived(delta || dx);

	const remapMouseEventTypes = [
		'click',
		'auxclick',
		'dblclick',
		'contextmenu',
		'mousedown',
		'mouseup',
		'mousemove',
		'mouseover',
		'mouseout',
		'mouseenter',
		'mouseleave',
		'wheel',
		'touchstart',
		'touchmove',
		'touchend',
		'touchcancel',
		'pointerdown',
		'pointerup',
		'pointermove',
		'pointerover',
		'pointerout',
		'pointerenter',
		'pointerleave',
		'pointercancel'
	] as const;

	const cloneEvent = (event: Event): Event => {
		try {
			const EventConstructor = event.constructor as new (
				type: string,
				eventInitDict?: EventInit
			) => Event;
			return new EventConstructor(event.type, event as any);
		} catch {
			return new Event(event.type, {
				bubbles: event.bubbles,
				cancelable: event.cancelable,
				composed: event.composed
			});
		}
	};

	$effect(() => {
		if (!container) return;
		let from = 0,
			fx = 0,
			run = false,
			vib = false;
		const handlers = [
			on(container, 'touchstart', (e) => {
				if (!container) return;
				e.stopPropagation();
				const { clientY, clientX } = e.touches[0];
				const { top, left } = container.getBoundingClientRect();
				from = clientY - top;
				fx = clientX - left;
				run = true;
				vib = false;
			}),
			on(container, 'touchmove', (e) => {
				if (!container) return;
				e.stopPropagation();
				if (!run) return;
				if (container.scrollTop > 0) {
					run = false;
					return;
				}
				const { clientY, clientX } = e.touches[0];
				const { top, left } = container.getBoundingClientRect();
				if (delta + clientY - top - from > 0) e.preventDefault();
				delta = Math.max(0, delta + clientY - top - from);
				if (delta > 10 && !vib) {
					if (config?.vibrate && typeof navigator.vibrate === 'function') navigator.vibrate(5);
					vib = true;
				}
				dx = dx + clientX - left - fx;
			}),
			on(container, 'touchend', (e) => {
				e.stopPropagation();
				run = false;
				if (delta > 100) show = false;
				else {
					const ret = () => {
						delta *= 0.8;
						dx *= 0.8;
						if (Math.abs(dx) < 0.1) dx = 0;
						if (delta < 1) delta = 0;
						if (delta || dx) requestAnimationFrame(ret);
					};
					requestAnimationFrame(ret);
				}
			})
		];
		return () => handlers.forEach((h) => h());
	});

	const vx = $derived(dx > 0 ? Math.pow(dx, 0.3) : -Math.pow(-dx, 0.3));

	let root = $state<HTMLDivElement | null>(null);
	let scrim = $state<HTMLDivElement | null>(null);
	let target = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!root || !remap) return;
		const to = root;
		const fromList = [target, scrim].filter((it): it is HTMLElement => !!it);
		if (!fromList.length) return;
		// Rebuild mouse/pointer bubbling across remapped DOM boundaries.
		const handlers = fromList.flatMap((from) =>
			remapMouseEventTypes.map((type) =>
				on(from, type, (event) => {
					event.stopPropagation();
					const forwarded = cloneEvent(event);
					if (from === target) {
						(forwarded as Event & { __paperRemapForwarded?: boolean }).__paperRemapForwarded = true;
					}
					const canceled = !to.dispatchEvent(forwarded);
					if (canceled && event.cancelable) event.preventDefault();
				})
			)
		);
		return () => handlers.forEach((off) => off());
	});

	$effect(() => {
		if (!target || !scrim || !root) return;
		if (remap) {
			document.body.appendChild(scrim);
			document.body.appendChild(target);
		}

		return () => {
			if (remap) {
				(root as HTMLDivElement).appendChild(scrim as any);
				(root as HTMLDivElement).appendChild(target as any);
			}
		};
	});

	$effect(() => {
		let _ = show;
		if (config?.vibrate && typeof navigator.vibrate === 'function') navigator.vibrate(10);
	});
</script>

<div class="root" bind:this={root}>
	<div class="scrim" class:remap bind:this={scrim} class:show></div>
	<main
		{...rest}
		class:remap
		class:hide={!show}
		bind:this={container}
		style:--delta="{delta}px"
		style:--dx="{vx}px"
		class:tr
		bind:this={target}
	>
		<div class="line">
			<div class="handle"></div>
		</div>
		<Render {children} />
	</main>
</div>

<style>
	.scrim {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2;
		opacity: 0;
		transition: opacity 0.2s;
		animation: fade 0.2s;

		&.show {
			opacity: 1;
		}
	}

	.line {
		width: 100%;
		height: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: sticky;
		top: 0;
		background: var(--surface);

		& .handle {
			height: 4px;
			width: 48px;
			border-radius: 2px;
			background: var(--on-surface);
			opacity: 0.5;
		}
	}

	main {
		box-shadow: 0 0 10px color-mix(in srgb, var(--on-surface) 16%, transparent);
		background: var(--surface);
		animation: show 0.15s cubic-bezier(0, 0.75, 0.25, 1);
		position: fixed;
		bottom: 12px;
		left: 12px;
		right: 12px;
		max-height: calc(100% - 24px);
		border-radius: 12px;
		z-index: 3;
		overflow-y: auto;
		overscroll-behavior: contain;

		&.tr {
			transform: translate(var(--dx), var(--delta));
		}

		&.hide {
			animation: hide 0.2s cubic-bezier(1, 0, 0.67, 1) forwards;
		}
	}

	.remap {
		z-index: 999999999;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes show {
		from {
			transform: translate(0, 100%);
		}
		to {
			transform: translate(var(--dx), 0);
		}
	}

	@keyframes hide {
		from {
			transform: translate(var(--dx), var(--delta));
		}
		to {
			transform: translate(0, 100%);
		}
	}
</style>
