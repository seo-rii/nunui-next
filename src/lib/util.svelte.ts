import { quadInOut } from 'svelte/easing';
import { on } from 'svelte/events';

export function tween(value: number, { duration = 500, easing = quadInOut } = {}) {
	let current = $state(value);
	let fromTs = 0,
		fromValue = value,
		toValue = value;
	let frame: number;

	const update = () => {
		const toTs = performance.now();
		const progress = Math.min(1, (toTs - fromTs) / duration);
		const eased = easing(progress);
		current = fromValue + (toValue - fromValue) * eased;

		if (progress < 1) frame = requestAnimationFrame(update);
		else frame = 0;
	};

	return {
		get value() {
			return current;
		},
		set value(v) {
			if (toValue !== v) {
				fromValue = current;
				toValue = v;
				fromTs = performance.now();
			}
			if (typeof requestAnimationFrame !== 'undefined') frame = requestAnimationFrame(update);
		},
		set(v: number) {
			fromValue = toValue = current = v;
			fromTs = performance.now();
			if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		}
	};
}

export function hovering(node: HTMLElement, hover: { v: boolean }) {
	hover.v = false;
	const handlers = [
		on(node, 'mouseenter', () => {
			hover.v = true;
		}),
		on(node, 'mouseleave', () => {
			hover.v = false;
		})
	];
	return () => handlers.forEach((off) => off());
}

export function delayedToggle(iv = false, setDelay = 200, clearDelay = 200) {
	let timer: number,
		value = $state(iv),
		realValue = $state(iv);
	return {
		get v() {
			return value;
		},
		get r() {
			return realValue;
		},
		set v(v: boolean) {
			realValue = v;
			if (v) {
				clearTimeout(timer);
				if (!value) timer = setTimeout(() => (value = true), setDelay);
			} else {
				clearTimeout(timer);
				if (value) timer = setTimeout(() => (value = false), clearDelay);
			}
		},
		set r(v: boolean) {
			clearTimeout(timer);
			realValue = v;
			value = v;
		}
	};
}

export function classes(...args: (string | string[] | Record<string, any>)[]) {
	return args
		.map((x) => {
			if (typeof x === 'string') return x.split(' ');
			if (Array.isArray(x)) return x;
			if (!x) return [];
			return Object.keys(x).filter((k) => x[k]);
		})
		.flat()
		.join(' ');
}
