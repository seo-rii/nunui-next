<script lang="ts">
	import { flushSync } from 'svelte';
	import { on } from 'svelte/events';
	import type { Renderable } from '$lib/util.svelte.js';
	import Render from '../etc/Render.svelte';

	type Placement = 'tl' | 'tc' | 'tr' | 'ml' | 'mr' | 'bl' | 'bc' | 'br';
	type AxisValue = number | { vertical?: number; horizontal?: number };
	type AutoMoveOption =
		| boolean
		| {
				threshold?: AxisValue;
				ratio?: AxisValue;
		  };

	const DEFAULT_AUTOMOVE_THRESHOLD = 96;
	const DEFAULT_AUTOMOVE_RATIO = 1.5;
	const PAPER_MARGIN = 12;
	const PAPER_OFFSET = 4;

	interface PaperDesktopProps {
		children?: Renderable;
		show?: boolean;
		panel?: HTMLElement | null;
		remap?: boolean;
		automove?: AutoMoveOption;
		tl?: boolean;
		tc?: boolean;
		tr?: boolean;
		ml?: boolean;
		mr?: boolean;
		bl?: boolean;
		bc?: boolean;
		br?: boolean;
		[key: string]: any;
	}

	let {
		children,
		show = $bindable(false),
		panel = $bindable<HTMLElement | null>(null),
		remap,
		automove = true,

		tl,
		tc,
		tr,
		ml,
		mr,
		bl,
		bc,
		br,
		...rest
	}: PaperDesktopProps = $props();
	let mh = $state('100vh'),
		mw = $state('100vw');
	let render = $state(false);
	let resolvedPlacement = $state<Placement | null>(null);
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
		const topSpace = Math.max(0, elTop - PAPER_MARGIN);
		const bottomSpace = Math.max(0, innerHeight - elBottom - PAPER_MARGIN);
		const startAlignedSpace = Math.max(0, innerWidth - elLeft - PAPER_MARGIN);
		const endAlignedSpace = Math.max(0, elRight - PAPER_MARGIN);
		const leftSideSpace = Math.max(0, elLeft - PAPER_MARGIN);
		const rightSideSpace = Math.max(0, innerWidth - elRight - PAPER_MARGIN);

		let placement: Placement | null = null;
		if (tl) placement = 'tl';
		else if (tc) placement = 'tc';
		else if (tr) placement = 'tr';
		else if (ml) placement = 'ml';
		else if (mr) placement = 'mr';
		else if (bl) placement = 'bl';
		else if (bc) placement = 'bc';
		else if (br) placement = 'br';

		let verticalThreshold = DEFAULT_AUTOMOVE_THRESHOLD;
		let horizontalThreshold = DEFAULT_AUTOMOVE_THRESHOLD;
		let verticalRatio = DEFAULT_AUTOMOVE_RATIO;
		let horizontalRatio = DEFAULT_AUTOMOVE_RATIO;

		if (automove && typeof automove === 'object') {
			const threshold = automove.threshold;
			const ratio = automove.ratio;

			if (typeof threshold === 'number' && Number.isFinite(threshold)) {
				verticalThreshold = threshold;
				horizontalThreshold = threshold;
			} else if (threshold && typeof threshold === 'object') {
				if (typeof threshold.vertical === 'number' && Number.isFinite(threshold.vertical)) {
					verticalThreshold = threshold.vertical;
				}
				if (typeof threshold.horizontal === 'number' && Number.isFinite(threshold.horizontal)) {
					horizontalThreshold = threshold.horizontal;
				}
			}

			if (typeof ratio === 'number' && Number.isFinite(ratio)) {
				verticalRatio = ratio;
				horizontalRatio = ratio;
			} else if (ratio && typeof ratio === 'object') {
				if (typeof ratio.vertical === 'number' && Number.isFinite(ratio.vertical)) {
					verticalRatio = ratio.vertical;
				}
				if (typeof ratio.horizontal === 'number' && Number.isFinite(ratio.horizontal)) {
					horizontalRatio = ratio.horizontal;
				}
			}
		}

		verticalThreshold = Math.max(0, verticalThreshold);
		horizontalThreshold = Math.max(0, horizontalThreshold);
		verticalRatio = Math.max(1, verticalRatio);
		horizontalRatio = Math.max(1, horizontalRatio);

		if (automove !== false && placement) {
			let currentVerticalSpace = -1;
			let oppositeVerticalSpace = -1;
			if (placement === 'tl' || placement === 'tc' || placement === 'tr') {
				currentVerticalSpace = topSpace;
				oppositeVerticalSpace = bottomSpace;
			} else if (placement === 'bl' || placement === 'bc' || placement === 'br') {
				currentVerticalSpace = bottomSpace;
				oppositeVerticalSpace = topSpace;
			}

			if (
				currentVerticalSpace >= 0 &&
				currentVerticalSpace < verticalThreshold &&
				oppositeVerticalSpace >= currentVerticalSpace * verticalRatio
			) {
				if (placement === 'tl') placement = 'bl';
				else if (placement === 'tc') placement = 'bc';
				else if (placement === 'tr') placement = 'br';
				else if (placement === 'bl') placement = 'tl';
				else if (placement === 'bc') placement = 'tc';
				else if (placement === 'br') placement = 'tr';
			}

			let currentHorizontalSpace = -1;
			let oppositeHorizontalSpace = -1;
			if (placement === 'tl' || placement === 'bl') {
				currentHorizontalSpace = startAlignedSpace;
				oppositeHorizontalSpace = endAlignedSpace;
			} else if (placement === 'tr' || placement === 'br') {
				currentHorizontalSpace = endAlignedSpace;
				oppositeHorizontalSpace = startAlignedSpace;
			} else if (placement === 'ml') {
				currentHorizontalSpace = leftSideSpace;
				oppositeHorizontalSpace = rightSideSpace;
			} else if (placement === 'mr') {
				currentHorizontalSpace = rightSideSpace;
				oppositeHorizontalSpace = leftSideSpace;
			}

			if (
				currentHorizontalSpace >= 0 &&
				currentHorizontalSpace < horizontalThreshold &&
				oppositeHorizontalSpace >= currentHorizontalSpace * horizontalRatio
			) {
				if (placement === 'tl') placement = 'tr';
				else if (placement === 'tr') placement = 'tl';
				else if (placement === 'bl') placement = 'br';
				else if (placement === 'br') placement = 'bl';
				else if (placement === 'ml') placement = 'mr';
				else if (placement === 'mr') placement = 'ml';
			}
		}

		resolvedPlacement = placement;

		if (placement === 'tl' || placement === 'tc' || placement === 'tr') {
			mh = `${topSpace}px`;
		} else if (placement === 'bl' || placement === 'bc' || placement === 'br') {
			mh = `${bottomSpace}px`;
		} else {
			mh = `${Math.min(topSpace, bottomSpace)}px`;
		}

		if (placement === 'tl' || placement === 'bl') {
			mw = `${startAlignedSpace}px`;
		} else if (placement === 'tr' || placement === 'br') {
			mw = `${endAlignedSpace}px`;
		} else if (placement === 'ml') {
			mw = `${leftSideSpace}px`;
		} else if (placement === 'mr') {
			mw = `${rightSideSpace}px`;
		} else {
			mw = `${Math.min(startAlignedSpace, endAlignedSpace)}px`;
		}

		if (remap) {
			if (placement === 'tl') {
				left = `${elLeft}px`;
				bottom = `${innerHeight - elTop + PAPER_OFFSET}px`;
			} else if (placement === 'tc') {
				left = `${(elLeft + elRight) / 2}px`;
				bottom = `${innerHeight - elTop + PAPER_OFFSET}px`;
			} else if (placement === 'tr') {
				right = `${innerWidth - elRight}px`;
				bottom = `${innerHeight - elTop + PAPER_OFFSET}px`;
			} else if (placement === 'ml') {
				right = `${innerWidth - elLeft + PAPER_OFFSET}px`;
				top = `${(elTop + elBottom) / 2}px`;
			} else if (placement === 'mr') {
				left = `${elRight + PAPER_OFFSET}px`;
				top = `${(elTop + elBottom) / 2}px`;
			} else if (placement === 'bl') {
				left = `${elLeft}px`;
				top = `${elBottom + PAPER_OFFSET}px`;
			} else if (placement === 'bc') {
				left = `${(elLeft + elRight) / 2}px`;
				top = `${elBottom + PAPER_OFFSET}px`;
			} else if (placement === 'br') {
				right = `${innerWidth - elRight}px`;
				top = `${elBottom + PAPER_OFFSET}px`;
			}
		} else {
			if (placement === 'tl') {
				left = '0';
				bottom = `calc(100% + ${PAPER_OFFSET}px)`;
			} else if (placement === 'tc') {
				left = '50%';
				bottom = `calc(100% + ${PAPER_OFFSET}px)`;
			} else if (placement === 'tr') {
				right = '0';
				bottom = `calc(100% + ${PAPER_OFFSET}px)`;
			} else if (placement === 'ml') {
				right = `calc(100% + ${PAPER_OFFSET}px)`;
				top = '50%';
			} else if (placement === 'mr') {
				left = `calc(100% + ${PAPER_OFFSET}px)`;
				top = '50%';
			} else if (placement === 'bl') {
				left = '0';
				top = `calc(100% + ${PAPER_OFFSET}px)`;
			} else if (placement === 'bc') {
				left = '50%';
				top = `calc(100% + ${PAPER_OFFSET}px)`;
			} else if (placement === 'br') {
				right = '0';
				top = `calc(100% + ${PAPER_OFFSET}px)`;
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
		class:tl={resolvedPlacement === 'tl'}
		class:tc={resolvedPlacement === 'tc'}
		class:tr={resolvedPlacement === 'tr'}
		class:ml={resolvedPlacement === 'ml'}
		class:mr={resolvedPlacement === 'mr'}
		class:bl={resolvedPlacement === 'bl'}
		class:bc={resolvedPlacement === 'bc'}
		class:br={resolvedPlacement === 'br'}
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
