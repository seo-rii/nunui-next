<script lang="ts">
	import { closeSnackbar, type ISnackbar, snack } from '$lib/snackbar.svelte.js';
	import { cubicIn, quartOut } from 'svelte/easing';
	import Icon from '$lib/etc/Icon.svelte';
	import Button from '$lib/button/Button.svelte';
	import IconButton from '$lib/button/IconButton.svelte';

	function int(node: Element, i: number) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = quartOut(t);

				return `transform: scale(${eased * 0.2 + 0.8 - i * 0.05}) translateY(${(1 - eased) * 10}px);opacity: ${eased};z-index:998;`;
			}
		};
	}

	function out(node: Element) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = cubicIn(t);

				return `opacity: ${eased};margin-top:${-60 + eased * 20}px;margin-bottom:${16 - 16 * eased}px`;
			}
		};
	}
</script>

{#snippet snackbar(snack: ISnackbar, i: number)}
	{#key snack.id}
		<article in:int|global={i} out:out|global style:transform="scale({1 - i * 0.05})">
			<span class="text">
				<Icon icon={snack.icon} />
				{snack.text}
			</span>
			<div>
				{#each snack.actions || [] as act}
					<Button small transparent icon={act.icon} onclick={act.onclick}>
						{act.text}
					</Button>
				{/each}
				{#if snack.dismissable !== false}
					<IconButton icon="close" onclick={() => closeSnackbar()} />
				{/if}
			</div>
		</article>
	{/key}
{/snippet}

{#if snack.length}
	<main>
		{#each snack.list.toReversed() as sn, i (sn.id)}
			{@render snackbar(sn, snack.length - i - 1)}
		{/each}
	</main>
{/if}

<style lang="scss">
	main {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: column-reverse;
		height: 28px;
		z-index: 1000;
	}

	article {
		padding: 12px;
		background: var(--primary-light1);
		border-radius: 8px;
		box-shadow: color-mix(in srgb, var(--on-surface), transparent 80%) 0 2px 5px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: min(100vw, 400px);
		margin-top: -34px;
		z-index: 999;
		position: relative;
		height: 20px;

		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

		& > * {
			display: flex;
			align-items: center;
			gap: 4px;
		}
	}
</style>
