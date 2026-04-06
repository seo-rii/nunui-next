<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type LoadingIndicatorVariant = 'uncontained' | 'contained';

	interface LoadingIndicatorProps extends HTMLAttributes<HTMLElement> {
		variant?: LoadingIndicatorVariant;
		size?: string | number;
		containerSize?: string | number;
		color?: string;
		containerColor?: string;
		secondary?: boolean;
		primary?: boolean;
	}

	let {
		variant = 'uncontained',
		size = '2.375rem',
		containerSize = '3rem',
		color = '',
		containerColor = '',
		secondary = false,
		primary = !secondary,
		style: _style = '',
		...rest
	}: LoadingIndicatorProps = $props();

	let resolvedSize = $derived(typeof size === 'number' ? `${size}px` : size);
	let resolvedContainerSize = $derived(
		typeof containerSize === 'number' ? `${containerSize}px` : containerSize
	);
	let style = $derived(
		`--loading-indicator-size: ${resolvedSize}; --loading-indicator-container-size: ${resolvedContainerSize}; ${_style}`
	);
</script>

<main
	{...rest}
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-busy="true"
	{style}
	class:contained={variant === 'contained'}
	class:uncontained={variant === 'uncontained'}
	class:_p={primary}
	class:_s={secondary}
>
	<div class="container" style:background={containerColor || undefined}>
		<div class="active-indicator" style:background={color || undefined}></div>
	</div>
</main>

<style>
	main {
		display: inline-block;
		aspect-ratio: 1 / 1;
		contain: strict;
		vertical-align: middle;
		width: var(--loading-indicator-size, 2.375rem);
		height: var(--loading-indicator-size, 2.375rem);
	}

	main.contained {
		width: var(--loading-indicator-container-size, 3rem);
		height: var(--loading-indicator-container-size, 3rem);
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
	}

	main.contained .container {
		background: var(--theme-light4);
	}

	.active-indicator {
		--shape-soft-burst: polygon(
			45.45% 1.06%,
			53.71% 0%,
			58.98% 8.05%,
			67.01% 10.87%,
			75.97% 7.35%,
			82.48% 12.48%,
			81.78% 22.05%,
			87.61% 28.29%,
			96.89% 30.88%,
			97.56% 39.12%,
			91.36% 46.44%,
			93.6% 54.84%,
			99.16% 62.56%,
			93.53% 68.87%,
			84.28% 71.38%,
			82.04% 80%,
			81.34% 89.32%,
			72.66% 90%,
			63.62% 87.04%,
			57.13% 93.48%,
			50.65% 100%,
			43.6% 94.59%,
			37.67% 87.33%,
			28.59% 89.51%,
			19.59% 90.21%,
			17.89% 81.31%,
			16.76% 72.19%,
			7.77% 69.18%,
			0.84% 63.83%,
			5.58% 55.83%,
			9.25% 47.62%,
			3.32% 40.12%,
			2.17% 31.73%,
			11.15% 28.59%,
			18.24% 23.38%,
			17.64% 13.82%,
			22.73% 7.23%,
			31.81% 10.38%,
			40.35% 9.16%,
			45.45% 1.06%
		);
		--shape-7-sided-cookie: polygon(
			41.88% 1.98%,
			49.72% 0.34%,
			57.59% 1.8%,
			64.32% 6.1%,
			71.29% 10.61%,
			79.22% 12.54%,
			86.48% 16.22%,
			91.68% 22.27%,
			94.24% 29.95%,
			94.31% 38.16%,
			96.46% 45.96%,
			99.7% 53.5%,
			100% 61.53%,
			97.26% 69.04%,
			91.97% 74.89%,
			85.7% 80.49%,
			81.84% 87.83%,
			77.07% 94.27%,
			70.24% 98.41%,
			62.29% 99.66%,
			54.24% 98.03%,
			46.15% 97.94%,
			38.12% 99.63%,
			30.13% 98.57%,
			23.21% 94.59%,
			18.23% 88.14%,
			14.51% 80.87%,
			8.32% 75.16%,
			2.91% 69.45%,
			0% 62%,
			0.11% 53.97%,
			3.27% 46.32%,
			5.57% 38.64%,
			5.63% 30.44%,
			8.01% 22.69%,
			13.07% 16.52%,
			20.22% 12.68%,
			28.18% 10.78%,
			35.08% 6.56%,
			35.08% 6.56%
		);
		--shape-pentagon: polygon(
			46.08% 1.72%,
			53.89% 1.71%,
			61.18% 4.93%,
			67.63% 9.62%,
			74.08% 14.3%,
			80.53% 18.99%,
			86.98% 23.68%,
			93.43% 28.44%,
			98.2% 34.75%,
			100% 42.36%,
			98.59% 50.23%,
			96.13% 57.81%,
			93.66% 65.4%,
			91.2% 72.98%,
			88.73% 80.56%,
			85.99% 88.11%,
			80.97% 94.16%,
			73.96% 97.67%,
			65.97% 98.29%,
			57.99% 98.29%,
			50.02% 98.29%,
			42.05% 98.29%,
			34.07% 98.29%,
			26.08% 97.68%,
			19.06% 94.19%,
			14.03% 88.14%,
			11.28% 80.6%,
			8.81% 73.02%,
			6.35% 65.43%,
			3.89% 57.85%,
			1.42% 50.26%,
			0% 42.4%,
			1.79% 34.79%,
			6.54% 28.47%,
			12.99% 23.7%,
			19.44% 19.01%,
			25.89% 14.33%,
			32.34% 9.64%,
			38.79% 4.95%,
			38.79% 4.95%
		);
		--shape-pill: polygon(
			47.37% 1.05%,
			55.07% 0%,
			62.83% 0.35%,
			70.43% 2.09%,
			77.68% 5.23%,
			84.37% 9.76%,
			90.23% 15.62%,
			94.76% 22.31%,
			97.9% 29.55%,
			99.65% 37.15%,
			100% 44.91%,
			98.96% 52.62%,
			96.52% 60.07%,
			92.68% 67.06%,
			87.45% 73.39%,
			81.83% 79.01%,
			76.21% 84.63%,
			70.33% 90.23%,
			63.65% 94.77%,
			56.4% 97.91%,
			48.8% 99.65%,
			41.04% 100%,
			33.33% 98.95%,
			25.88% 96.51%,
			18.89% 92.68%,
			12.56% 87.45%,
			7.33% 81.12%,
			3.49% 74.13%,
			1.05% 66.68%,
			0% 58.97%,
			0.35% 51.22%,
			2.09% 43.61%,
			5.23% 36.37%,
			9.76% 29.68%,
			15.36% 23.8%,
			20.98% 18.18%,
			26.6% 12.56%,
			26.6% 12.56%,
			32.93% 7.33%,
			39.92% 3.49%
		);
		--shape-very-sunny: polygon(
			42.69% 4.4%,
			50.02% 0.26%,
			57.33% 4.43%,
			62.01% 11.92%,
			69.95% 14.6%,
			78.61% 12.52%,
			86.26% 15.79%,
			87.51% 24.18%,
			85.79% 32.82%,
			90.46% 39.81%,
			97.94% 44.65%,
			100% 52.64%,
			94.2% 58.98%,
			87.17% 64.18%,
			86.45% 72.62%,
			87.95% 81.37%,
			82.9% 87.86%,
			74.2% 87.48%,
			65.58% 86.74%,
			59.58% 92.86%,
			54.09% 99.74%,
			45.88% 99.73%,
			40.41% 92.82%,
			34.4% 86.73%,
			25.77% 87.49%,
			17.07% 87.84%,
			12.06% 81.33%,
			13.57% 72.58%,
			12.82% 64.15%,
			5.78% 58.96%,
			0% 52.61%,
			2.1% 44.62%,
			9.59% 39.79%,
			14.22% 32.78%,
			12.49% 24.14%,
			13.77% 15.76%,
			21.44% 12.53%,
			30.09% 14.61%,
			38.03% 11.9%,
			42.69% 4.4%
		);
		--shape-4-sided-cookie: polygon(
			55.11% 5.44%,
			63.86% 2.27%,
			63.86% 2.27%,
			73.48% 0.06%,
			82.5% 1.45%,
			90.28% 5.78%,
			96.16% 12.42%,
			99.52% 20.71%,
			99.69% 30.02%,
			96.51% 39.29%,
			94.21% 48.26%,
			95.22% 57.42%,
			98.75% 66.34%,
			100% 75.87%,
			97.82% 84.64%,
			92.85% 92%,
			85.74% 97.32%,
			77.13% 99.94%,
			67.67% 99.22%,
			58.64% 95.68%,
			49.52% 94.21%,
			40.46% 96.04%,
			31.34% 99.48%,
			21.94% 99.81%,
			13.46% 96.87%,
			6.55% 91.3%,
			1.85% 83.76%,
			0% 74.87%,
			1.65% 65.3%,
			5.09% 56.46%,
			5.74% 47.27%,
			3.14% 38.37%,
			0.2% 28.99%,
			0.74% 19.76%,
			4.4% 11.61%,
			10.52% 5.19%,
			18.46% 1.15%,
			27.58% 0.12%,
			37.1% 2.66%,
			45.91% 5.62%
		);
		--shape-oval: polygon(
			57.64% 1.79%,
			65.3% 0.28%,
			72.61% 0%,
			79.4% 0.98%,
			85.54% 3.25%,
			90.85% 6.84%,
			95.11% 11.68%,
			98.04% 17.42%,
			99.66% 23.91%,
			100% 30.98%,
			99.1% 38.48%,
			96.99% 46.27%,
			93.7% 54.17%,
			89.27% 62.06%,
			83.73% 69.75%,
			77.12% 77.12%,
			69.75% 83.73%,
			62.06% 89.27%,
			54.17% 93.7%,
			46.27% 96.99%,
			38.48% 99.1%,
			30.98% 100%,
			23.91% 99.66%,
			17.42% 98.04%,
			11.68% 95.11%,
			6.84% 90.85%,
			3.25% 85.54%,
			0.98% 79.4%,
			0% 72.61%,
			0.28% 65.3%,
			1.79% 57.64%,
			4.49% 49.77%,
			8.36% 41.86%,
			13.34% 34.05%,
			19.43% 26.5%,
			26.5% 19.43%,
			34.05% 13.34%,
			41.86% 8.36%,
			49.77% 4.49%
		);
		width: calc(var(--loading-indicator-size, 2.375rem) * 0.842);
		aspect-ratio: 1 / 1;
		background: var(--theme);
		transform-origin: center;
		will-change: transform, clip-path;
		clip-path: var(--shape-soft-burst);
		animation: m3e-loading-rotate 4998ms infinite;
	}

	main.contained .active-indicator {
		background: var(--on-theme);
	}

	@keyframes m3e-loading-rotate {
		0% {
			clip-path: var(--shape-soft-burst);
			transform: rotate(0deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		14% {
			clip-path: var(--shape-7-sided-cookie);
			transform: rotate(154deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		29% {
			clip-path: var(--shape-pentagon);
			transform: rotate(309deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		43% {
			clip-path: var(--shape-pill);
			transform: rotate(463deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		57% {
			clip-path: var(--shape-very-sunny);
			transform: rotate(617deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		71% {
			clip-path: var(--shape-4-sided-cookie);
			transform: rotate(771deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		83% {
			clip-path: var(--shape-oval);
			transform: rotate(926deg);
			animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
		}

		100% {
			clip-path: var(--shape-soft-burst);
			transform: rotate(1080deg);
		}
	}

	@media (forced-colors: active) {
		.active-indicator {
			background: CanvasText !important;
		}
	}
</style>
