<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { uniqueId } from '$lib/util.svelte.js';

	export type SliderRange = [number, number];
	export type SliderValue = number | SliderRange;

	type SliderThumb = 'start' | 'end';
	type ActiveThumb = SliderThumb | 'overlap';
	type NativeSliderEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

	interface SliderProps extends Omit<
		HTMLInputAttributes,
		'type' | 'value' | 'min' | 'max' | 'step' | 'disabled' | 'children'
	> {
		value?: number;
		values?: SliderRange;
		range?: boolean;
		min?: number;
		max?: number;
		step?: number | 'any';
		disabled?: boolean;
		ticks?: boolean;
		primary?: boolean;
		secondary?: boolean;
		startName?: string;
		endName?: string;
		startLabel?: string;
		endLabel?: string;
		startValueText?: string;
		endValueText?: string;
	}

	let {
		min = 0,
		max = 100,
		step = 1,
		value = $bindable(min),
		values = $bindable<SliderRange>([min, max]),
		range = false,
		disabled = false,
		ticks = false,
		secondary = false,
		primary = !secondary,
		startName,
		endName,
		startLabel = 'Minimum value',
		endLabel = 'Maximum value',
		startValueText,
		endValueText,
		id: _id,
		name,
		class: className,
		style,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-valuetext': ariaValueText,
		oninput,
		onchange,
		...rest
	}: SliderProps = $props();

	let id = $derived(_id || uniqueId('slider'));
	let finiteMin = $derived(Number.isFinite(min) ? min : 0);
	let finiteMax = $derived(Number.isFinite(max) ? max : 100);
	let lowerBound = $derived(Math.min(finiteMin, finiteMax));
	let upperBound = $derived(
		finiteMin === finiteMax ? finiteMin + 1 : Math.max(finiteMin, finiteMax)
	);
	let resolvedStep: number | 'any' = $derived.by(() => {
		if (step === 'any') return 'any';
		const numericStep = Number(step);
		return Number.isFinite(numericStep) && numericStep > 0 ? numericStep : 1;
	});

	function normalizeValue(candidate: number) {
		const finiteCandidate = Number.isFinite(candidate) ? candidate : lowerBound;
		const clamped = Math.min(upperBound, Math.max(lowerBound, finiteCandidate));
		if (resolvedStep === 'any') return Number(clamped.toPrecision(14));

		const minParts = String(Math.abs(lowerBound)).toLowerCase().split('e');
		const stepParts = String(Math.abs(resolvedStep)).toLowerCase().split('e');
		const minPrecision = Math.max(
			0,
			(minParts[0]?.split('.')[1]?.length ?? 0) - Number(minParts[1] ?? 0)
		);
		const stepPrecision = Math.max(
			0,
			(stepParts[0]?.split('.')[1]?.length ?? 0) - Number(stepParts[1] ?? 0)
		);
		const scale = 10 ** Math.min(12, Math.max(minPrecision, stepPrecision));
		const scaledMin = Math.round(lowerBound * scale);
		const scaledMax = Math.round(upperBound * scale);
		const scaledStep = Math.max(1, Math.round(resolvedStep * scale));
		const scaledCandidate = Math.round(clamped * scale);
		const maxSteps = Math.max(0, Math.floor((scaledMax - scaledMin) / scaledStep));
		const candidateSteps = Math.round((scaledCandidate - scaledMin) / scaledStep);
		const snappedSteps = Math.max(0, Math.min(maxSteps, candidateSteps));
		return (scaledMin + snappedSteps * scaledStep) / scale;
	}

	let normalizedValue = $derived(normalizeValue(value));
	let normalizedValues: SliderRange = $derived.by(() => {
		const first = normalizeValue(values[0]);
		const second = normalizeValue(values[1]);
		return first <= second ? [first, second] : [second, first];
	});
	let startValue = $derived(range ? normalizedValues[0] : lowerBound);
	let endValue = $derived(range ? normalizedValues[1] : normalizedValue);
	let span = $derived(upperBound - lowerBound);
	let startPosition = $derived(((startValue - lowerBound) / span) * 100);
	let endPosition = $derived(((endValue - lowerBound) / span) * 100);
	let startAriaLabel = $derived(ariaLabel ? `${ariaLabel}, ${startLabel}` : startLabel);
	let endAriaLabel = $derived(ariaLabel ? `${ariaLabel}, ${endLabel}` : endLabel);
	let tickValues: number[] = $derived.by(() => {
		if (!ticks || resolvedStep === 'any') return [];
		const rawStepCount = span / resolvedStep;
		const roundedStepCount = Math.round(rawStepCount);
		const stepCount =
			Math.abs(rawStepCount - roundedStepCount) < 1e-9
				? roundedStepCount
				: Math.floor(rawStepCount);
		if (stepCount <= 1 || stepCount > 100) return [];

		return Array.from({ length: stepCount - 1 }, (_, index) =>
			normalizeValue(lowerBound + (index + 1) * resolvedStep)
		).filter((tickValue, index, all) => {
			return (
				tickValue > lowerBound &&
				tickValue < upperBound &&
				(index === 0 || tickValue !== all[index - 1])
			);
		});
	});

	let track = $state<HTMLDivElement | null>(null);
	let startInput = $state<HTMLInputElement | null>(null);
	let endInput = $state<HTMLInputElement | null>(null);
	let activePointerId = $state<number | null>(null);
	let activeThumb = $state<ActiveThumb | null>(null);
	let pointerChanged = $state(false);

	function inputForThumb(thumb: SliderThumb) {
		return thumb === 'start' ? startInput : endInput;
	}

	function setThumb(thumb: SliderThumb, candidate: number) {
		const next = normalizeValue(candidate);
		if (!range) {
			if (value === next) return false;
			value = next;
			return true;
		}

		const nextValues: SliderRange =
			thumb === 'start'
				? [Math.min(next, endValue), endValue]
				: [startValue, Math.max(next, startValue)];
		if (values[0] === nextValues[0] && values[1] === nextValues[1]) return false;
		values = nextValues;
		return true;
	}

	function valueFromPointer(event: PointerEvent) {
		if (!track) return null;
		const rect = track.getBoundingClientRect();
		if (!rect.width) return null;
		let ratio = (event.clientX - rect.left) / rect.width;
		if (getComputedStyle(track).direction === 'rtl') ratio = 1 - ratio;
		ratio = Math.min(1, Math.max(0, ratio));
		return normalizeValue(lowerBound + ratio * span);
	}

	function focusThumb(thumb: SliderThumb) {
		inputForThumb(thumb)?.focus({ preventScroll: true });
	}

	function emitNativeEvent(type: 'input' | 'change', thumb: SliderThumb) {
		const input = inputForThumb(thumb);
		if (!input) return;
		input.value = String(thumb === 'start' ? startValue : endValue);
		input.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
	}

	function movePointerThumb(thumb: SliderThumb, candidate: number) {
		focusThumb(thumb);
		if (!setThumb(thumb, candidate)) return;
		pointerChanged = true;
		emitNativeEvent('input', thumb);
	}

	function handlePointerDown(event: PointerEvent) {
		if (disabled || activePointerId !== null) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		const candidate = valueFromPointer(event);
		if (candidate === null) return;

		event.preventDefault();
		activePointerId = event.pointerId;
		pointerChanged = false;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

		if (!range) {
			activeThumb = 'end';
			movePointerThumb('end', candidate);
			return;
		}

		if (startValue === endValue && candidate === startValue) {
			activeThumb = 'overlap';
			focusThumb('end');
			return;
		}

		const startDistance = Math.abs(candidate - startValue);
		const endDistance = Math.abs(candidate - endValue);
		const thumb: SliderThumb =
			startDistance < endDistance
				? 'start'
				: endDistance < startDistance
					? 'end'
					: candidate < (startValue + endValue) / 2
						? 'start'
						: 'end';
		activeThumb = thumb;
		movePointerThumb(thumb, candidate);
	}

	function handlePointerMove(event: PointerEvent) {
		if (event.pointerId !== activePointerId || activeThumb === null) return;
		const candidate = valueFromPointer(event);
		if (candidate === null) return;
		event.preventDefault();

		if (activeThumb === 'overlap') {
			if (candidate === startValue) return;
			activeThumb = candidate < startValue ? 'start' : 'end';
		}
		movePointerThumb(activeThumb, candidate);
	}

	function finishPointer(event: PointerEvent) {
		if (event.pointerId !== activePointerId) return;
		const target = event.currentTarget as HTMLElement;
		const committedThumb = activeThumb;
		const shouldEmitChange =
			pointerChanged && committedThumb !== null && committedThumb !== 'overlap';

		activePointerId = null;
		activeThumb = null;
		pointerChanged = false;
		if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
		if (shouldEmitChange) emitNativeEvent('change', committedThumb);
	}

	function handleNativeInput(event: NativeSliderEvent, thumb: SliderThumb) {
		setThumb(thumb, Number(event.currentTarget.value));
		event.currentTarget.value = String(thumb === 'start' ? startValue : endValue);
		oninput?.(event);
	}
</script>

<main
	class={className}
	class:_p={primary}
	class:_s={secondary}
	class:range
	class:disabled
	{style}
	style:--start-position={`${startPosition}%`}
	style:--end-position={`${endPosition}%`}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={finishPointer}
	onpointercancel={finishPointer}
	onlostpointercapture={finishPointer}
>
	<div class="track" bind:this={track} aria-hidden="true">
		<span class="segment lower" class:active={!range}></span>
		{#if range}
			<span class="segment middle active"></span>
		{/if}
		<span class="segment upper">
			<span class="stop"></span>
		</span>

		{#each tickValues as tickValue (tickValue)}
			<span
				class="tick"
				class:active={range
					? tickValue >= startValue && tickValue <= endValue
					: tickValue <= endValue}
				style:--position={`${((tickValue - lowerBound) / span) * 100}%`}
			></span>
		{/each}
	</div>

	{#if range}
		<span
			class="handle-position start"
			class:pressed={activeThumb === 'start'}
			style:--position={`${startPosition}%`}
			aria-hidden="true"
		>
			<span class="handle-hit">
				<span class="state-layer"></span>
				<span class="handle"></span>
			</span>
		</span>
	{/if}
	<span
		class="handle-position end"
		class:pressed={activeThumb === 'end'}
		style:--position={`${endPosition}%`}
		aria-hidden="true"
	>
		<span class="handle-hit">
			<span class="state-layer"></span>
			<span class="handle"></span>
		</span>
	</span>

	{#if range}
		{#if ariaLabelledby}
			<span class="visually-hidden" id={`${id}-start-label`}>{startLabel}</span>
			<span class="visually-hidden" id={`${id}-end-label`}>{endLabel}</span>
		{/if}
		<input
			{...rest}
			class="native start"
			type="range"
			id={`${id}-start`}
			name={startName ?? name}
			min={lowerBound}
			max={endValue}
			step={resolvedStep}
			value={startValue}
			{disabled}
			aria-label={ariaLabelledby ? undefined : startAriaLabel}
			aria-labelledby={ariaLabelledby ? `${ariaLabelledby} ${id}-start-label` : undefined}
			aria-valuemin={lowerBound}
			aria-valuemax={endValue}
			aria-valuenow={startValue}
			aria-valuetext={startValueText}
			bind:this={startInput}
			oninput={(event) => handleNativeInput(event, 'start')}
			{onchange}
		/>
	{/if}
	<input
		{...rest}
		class="native end"
		type="range"
		id={range ? `${id}-end` : id}
		name={range ? (endName ?? name) : name}
		min={range ? startValue : lowerBound}
		max={upperBound}
		step={resolvedStep}
		value={endValue}
		{disabled}
		aria-label={range ? (ariaLabelledby ? undefined : endAriaLabel) : ariaLabel}
		aria-labelledby={range
			? ariaLabelledby
				? `${ariaLabelledby} ${id}-end-label`
				: undefined
			: ariaLabelledby}
		aria-valuemin={range ? startValue : lowerBound}
		aria-valuemax={upperBound}
		aria-valuenow={endValue}
		aria-valuetext={range ? endValueText : ariaValueText}
		bind:this={endInput}
		oninput={(event) => handleNativeInput(event, 'end')}
		{onchange}
	/>
</main>

<style>
	main {
		--track-gap: 6px;
		--handle-half: 2px;
		--start-offset: calc(var(--track-gap) + var(--handle-half));
		--end-offset: calc(var(--track-gap) + var(--handle-half));
		position: relative;
		display: inline-block;
		width: 100%;
		min-width: 48px;
		height: 48px;
		vertical-align: middle;
		touch-action: pan-y;
		user-select: none;
		cursor: pointer;
	}

	main:has(input.start:focus-visible),
	main:has(.handle-position.start.pressed) {
		--start-offset: calc(var(--track-gap) + 1px);
	}

	main:has(input.end:focus-visible),
	main:has(.handle-position.end.pressed) {
		--end-offset: calc(var(--track-gap) + 1px);
	}

	main.disabled {
		cursor: not-allowed;
	}

	.track {
		position: absolute;
		inset-block-start: 16px;
		inset-inline: 2px;
		height: 16px;
		pointer-events: none;
	}

	.segment {
		position: absolute;
		inset-block: 0;
		background: color-mix(in srgb, var(--theme) 24%, var(--surface));
		overflow: hidden;
		transition: background-color 0.2s ease;
	}

	.segment.active {
		background: var(--theme);
	}

	.segment.lower {
		inset-inline-start: 0;
		width: max(0px, calc(var(--start-position) - var(--start-offset)));
		border-start-start-radius: 8px;
		border-end-start-radius: 8px;
		border-start-end-radius: 2px;
		border-end-end-radius: 2px;
	}

	main:not(.range) .segment.lower {
		width: max(0px, calc(var(--end-position) - var(--end-offset)));
	}

	.segment.middle {
		inset-inline-start: min(100%, calc(var(--start-position) + var(--start-offset)));
		width: max(
			0px,
			calc(var(--end-position) - var(--start-position) - var(--start-offset) - var(--end-offset))
		);
		border-radius: 2px;
	}

	.segment.upper {
		inset-inline-start: min(100%, calc(var(--end-position) + var(--end-offset)));
		width: max(0px, calc(100% - var(--end-position) - var(--end-offset)));
		border-start-start-radius: 2px;
		border-end-start-radius: 2px;
		border-start-end-radius: 8px;
		border-end-end-radius: 8px;
	}

	.stop,
	.tick::before {
		content: '';
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--on-surface) 62%, var(--surface));
	}

	.stop {
		inset-block-start: 50%;
		inset-inline-end: 6px;
		transform: translateY(-50%);
	}

	.tick {
		position: absolute;
		z-index: 1;
		inset-block-start: 50%;
		inset-inline-start: var(--position);
		width: 0;
		height: 0;
	}

	.tick::before {
		inset-block-start: 0;
		left: 0;
		transform: translate(-50%, -50%);
	}

	.tick.active::before {
		background: var(--on-theme);
	}

	.handle-position {
		position: absolute;
		z-index: 2;
		inset-block-start: 50%;
		inset-inline-start: var(--position);
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.handle-position.pressed,
	main:has(input.start:focus) .handle-position.start,
	main:has(input.end:focus) .handle-position.end {
		z-index: 3;
	}

	.handle-hit {
		position: absolute;
		inset-block-start: 0;
		left: 0;
		width: 48px;
		height: 48px;
		transform: translate(-50%, -50%);
		pointer-events: auto;
		cursor: grab;
	}

	.handle,
	.state-layer {
		position: absolute;
		inset-block-start: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.handle {
		width: 4px;
		height: 44px;
		border-radius: 999px;
		background: var(--theme);
		transition:
			width 0.15s ease,
			background-color 0.2s ease;
	}

	.state-layer {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--theme), transparent 88%);
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.handle-hit:hover .state-layer,
	.handle-position.pressed .state-layer,
	main:has(input.start:focus-visible) .handle-position.start .state-layer,
	main:has(input.end:focus-visible) .handle-position.end .state-layer {
		opacity: 1;
	}

	.handle-position.pressed .handle,
	main:has(input.start:focus-visible) .handle-position.start .handle,
	main:has(input.end:focus-visible) .handle-position.end .handle {
		width: 2px;
	}

	main:has(input.start:focus-visible) .handle-position.start .state-layer,
	main:has(input.end:focus-visible) .handle-position.end .state-layer {
		outline: 2px solid color-mix(in srgb, var(--theme), transparent 40%);
		outline-offset: 1px;
	}

	main.disabled .handle-hit {
		cursor: not-allowed;
	}

	main.disabled .handle {
		background: color-mix(in srgb, var(--on-surface) 38%, var(--surface));
	}

	main.disabled .segment.active {
		background: color-mix(in srgb, var(--on-surface) 38%, var(--surface));
	}

	main.disabled .segment:not(.active) {
		background: color-mix(in srgb, var(--on-surface) 12%, var(--surface));
	}

	main.disabled .stop,
	main.disabled .tick::before {
		background: color-mix(in srgb, var(--on-surface) 38%, var(--surface));
	}

	main.disabled .state-layer {
		display: none;
	}

	.native {
		-webkit-appearance: none;
		appearance: none;
		position: absolute;
		z-index: 4;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border: 0;
		outline: 0;
		background: transparent;
		opacity: 0;
		pointer-events: none;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (forced-colors: active) {
		.segment,
		main.disabled .segment:not(.active) {
			background: GrayText;
		}

		.segment.active,
		.handle,
		main.disabled .handle,
		main.disabled .segment.active {
			background: Highlight;
		}

		.stop,
		.tick::before,
		.tick.active::before,
		main.disabled .stop,
		main.disabled .tick::before {
			background: Canvas;
		}

		.state-layer {
			background: transparent;
		}

		main:has(input.start:focus-visible) .handle-position.start .state-layer,
		main:has(input.end:focus-visible) .handle-position.end .state-layer {
			outline-color: Highlight;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.segment,
		.handle,
		.state-layer {
			transition: none;
		}
	}
</style>
