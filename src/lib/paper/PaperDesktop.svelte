<script lang="ts">
	import { flushSync } from 'svelte';
	import { on } from 'svelte/events';
	import Render from '../etc/Render.svelte';

	let {
		children,
		show = $bindable(false),
		panel = $bindable<HTMLElement | null>(null),
		remap,

		tl,
		tc,
		tr,
		ml,
		mr,
		bl,
		bc,
		br,
		...rest
	} = $props();
	let mh = $state('100vh'),
		mw = $state('100vw');
	let render = $state(false);
	let scrollX = $state(0),
		scrollY = $state(0);

	let left = $state('');
	let top = $state('');
	let right = $state('');
	let bottom = $state('');

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

	let root = $state<HTMLDivElement | null>(null);
	$effect(() => {
		if (!panel || !root || !remap) return;
		const from = panel;
		const to = root;
		// Rebuild mouse/pointer bubbling across remapped DOM boundaries.
		const handlers = remapMouseEventTypes.map((type) =>
			on(from, type, (event) => {
				event.stopPropagation();
				const forwarded = cloneEvent(event);
				(forwarded as Event & { __paperRemapForwarded?: boolean }).__paperRemapForwarded = true;
				const canceled = !to.dispatchEvent(forwarded);
				if (canceled && event.cancelable) event.preventDefault();
			})
		);
		return () => handlers.forEach((off) => off());
	});

	$effect(() => {
		if (!panel || !root) return;
		if (remap) {
			document.body.appendChild(panel);
		}
		let [_, __] = [scrollX, scrollY];
		const {
			top: elTop,
			left: elLeft,
			bottom: elBottom,
			right: elRight
		} = (root?.parentElement as HTMLElement).getBoundingClientRect();
		left = '';
		top = '';
		right = '';
		bottom = '';

		flushSync();
		const { innerHeight, innerWidth } = window;
		if (tl || tc || tr) {
			mh = `${elTop - 12}px`;
		} else if (bl || bc || br) {
			mh = `${innerHeight - elBottom - 12}px`;
		} else {
			mh = `${Math.min(elTop, innerHeight - elBottom) - 12}px`;
		}

		if (tl || bl) {
			mw = `${innerWidth - elLeft - 12}px`;
		} else if (tr || br) {
			mw = `${elRight - 12}px`;
		} else if (ml) {
			mw = `${elLeft - 12}px`;
		} else if (mr) {
			mw = `${innerWidth - elRight - 12}px`;
		} else {
			mw = `${Math.min(innerWidth - elLeft, elRight) - 12}px`;
		}
		if (remap) {
			if (tl) {
				left = elLeft + 'px';
				bottom = innerHeight - elTop + 4 + 'px';
			} else if (tc) {
				left = (elLeft + elRight) / 2 + 'px';
				bottom = innerHeight - elTop + 4 + 'px';
			} else if (tr) {
				right = innerWidth - elRight + 'px';
				bottom = innerHeight - elTop + 4 + 'px';
			} else if (ml) {
				right = innerWidth - elLeft + 4 + 'px';
				top = (elTop + elBottom) / 2 + 'px';
			} else if (mr) {
				left = elRight + 4 + 'px';
				top = (elTop + elBottom) / 2 + 'px';
			} else if (bl) {
				left = elLeft + 'px';
				top = elBottom + 4 + 'px';
			} else if (bc) {
				left = (elLeft + elRight) / 2 + 'px';
				top = elBottom + 4 + 'px';
			} else if (br) {
				right = innerWidth - elRight + 'px';
				top = elBottom + 4 + 'px';
			}
		} else {
			if (tl) {
				left = '0';
				bottom = 'calc(100% + 4px)';
			} else if (tc) {
				left = '50%';
				bottom = 'calc(100% + 4px)';
			} else if (tr) {
				right = '0';
				bottom = 'calc(100% + 4px)';
			} else if (ml) {
				right = 'calc(100% + 4px)';
				top = '50%';
			} else if (mr) {
				left = 'calc(100% + 4px)';
				top = '50%';
			} else if (bl) {
				left = '0';
				top = 'calc(100% + 4px)';
			} else if (bc) {
				left = '50%';
				top = 'calc(100% + 4px)';
			} else if (br) {
				right = '0';
				top = 'calc(100% + 4px)';
			}
		}
		flushSync();
		render = true;

		return () => {
			if (remap) (root as HTMLDivElement).appendChild(panel as any);
		};
	});
</script>

<svelte:window bind:scrollX bind:scrollY />
<div class="root" bind:this={root}>
	<main
		class:exit={!show}
		{...rest}
		class:tl
		class:tc
		class:tr
		class:ml
		class:mr
		class:bl
		class:bc
		class:br
		style:max-height={mh}
		style:max-width={mw}
		style:left
		style:top
		style:right
		style:bottom
		class:remap
		class:ready={render}
		bind:this={panel}
	>
		{#if render}
			<Render {children} />
		{/if}
	</main>
</div>

<style>
	main {
		box-shadow: 0 0 10px color-mix(in srgb, var(--on-surface) 16%, transparent);
		background: var(--surface);
		width: max-content;
		position: absolute;
		border-radius: 12px;
		translate: var(--paper-translate-x, 0) var(--paper-translate-y, 0);

		z-index: var(--paper-z-index, 3);
		overflow: auto;
		overscroll-behavior: contain;
		opacity: 0;
		pointer-events: none;

		&.ready {
			animation: show 0.15s cubic-bezier(0, 0.75, 0.25, 1);
			opacity: 1;
			pointer-events: auto;
		}

		&.remap {
			position: fixed;
			z-index: 999999999;
		}

		&.exit {
			animation: hide 0.2s cubic-bezier(1, 0, 0.67, 1) forwards;
			pointer-events: none;
		}

		&.tl {
			transform-origin: bottom left;
		}

		&.tc {
			--paper-translate-x: -50%;
			transform-origin: bottom center;
		}

		&.tr {
			transform-origin: bottom right;
		}

		&.ml {
			--paper-translate-y: -50%;
			transform-origin: center right;
		}

		&.mr {
			--paper-translate-y: -50%;
			transform-origin: center left;
		}

		&.bl {
			transform-origin: top left;
		}

		&.bc {
			--paper-translate-x: -50%;
			transform-origin: top center;
		}

		&.br {
			top: calc(100% + 4px);
			right: 0;
			transform-origin: top right;
		}
	}

	@keyframes show {
		from {
			opacity: 0;
			transform: scale(0.85);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes hide {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.8);
		}
	}
</style>
