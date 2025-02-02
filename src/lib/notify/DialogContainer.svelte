<script lang="ts">
	import { quartOut } from 'svelte/easing';
	import Icon from '$lib/etc/Icon.svelte';
	import Button from '$lib/button/Button.svelte';
	import { closeDialog, type IDialog, dialog } from './dialog.svelte.js';
	import { fade } from 'svelte/transition';
	import Render from '$lib/etc/Render.svelte';

	function int(node: Element) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = quartOut(t);

				return `transform: scale(${eased * 0.2 + 0.8}) translateY(${(1 - eased) * 10}px);opacity: ${eased};z-index:998;`;
			}
		};
	}

	function out(node: Element) {
		return {
			duration: 200,
			css: (t: number) => {
				const eased = quartOut(t);

				return `transform: scale(${eased * 0.2 + 0.8}) translateY(${(1 - eased) * -10}px);opacity: ${eased};z-index:998;`;
			}
		};
	}
</script>

{#snippet dialogUI(dialog: IDialog)}
	{#key dialog.id}
		<article in:int|global out:out|global style:--mw={dialog.maxWidth}>
			<span class="title"><Icon icon={dialog.icon} />{dialog.title}</span>
			<span class="text">
				{dialog.text}
				{#if dialog.snip}
					<Render it={dialog.snip} />
				{:else if dialog.comp}
					{@const Comp = dialog.comp}
					<Comp />
				{/if}
			</span>
			{#if dialog.actions?.length}
				<div class="act">
					{#each dialog.actions || [] as act}
						<Button small transparent icon={act.icon} onclick={act.onclick}>
							{act.text}
						</Button>
					{/each}
				</div>
			{/if}
		</article>
	{/key}
{/snippet}

{#if dialog.length}
	<main
		role="presentation"
		onclick={(e) =>
			e.currentTarget === e.target && dialog.active?.dismissable !== false && closeDialog()}
		transition:fade|global={{ duration: 200 }}
	>
		{@render dialogUI(dialog.active)}
	</main>
{/if}

<style lang="scss">
	.scrim {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
	}

	main {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1001;
	}

	article {
		padding: 18px;
		background: var(--primary-light1);
		border-radius: 12px;
		box-shadow: color-mix(in srgb, var(--on-surface), transparent 80%) 0 2px 5px 0;
		justify-content: center;
		min-width: min(calc(100svw - 48px), var(--mw, 500px));
		max-width: calc(100svw - 48px);
		max-height: calc(100svh - 56px);
		overflow-y: auto;
		position: relative;

		transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.title {
		font-size: 1.4rem;
		font-weight: 300;
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 8px;
	}

	.text {
		color: color-mix(in srgb, var(--primary-dark3), transparent 20%);
	}

	.act {
		justify-content: flex-end;
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 6px;
	}
</style>
