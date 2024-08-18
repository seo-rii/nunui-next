<script lang="ts">
    import type {HTMLAttributes} from 'svelte/elements';
    import {Ripple} from "$lib";
    import Icon from "$lib/etc/Icon.svelte";
    import Render from "$lib/etc/Render.svelte";
    import Paper from "$lib/paper/Paper.svelte";
    import {classes} from "$lib/util.svelte.js";

    type Props = {
        primary?: boolean;
        secondary?: boolean;
    } & HTMLAttributes<HTMLButtonElement>;

    let {
        children,
        secondary, primary = !secondary,
        icon,
        outlined, transparent, raised,
        disabled,

        round,
        small, large,

        tooltip,
        active,
        class: className,

        full = false,

        ...rest
    } = $props<Props>();

    const buttonClass = $derived(classes(className, {
        primary,
        secondary,
        outlined,
        transparent,
        raised,
        round,
        small,
        large,
        full,
    }, Object.keys(rest).filter(x => x.startsWith('light-') || x.startsWith('dark-'))));
</script>

{#snippet button()}
    <button {...rest} class={buttonClass} aria-label={tooltip}>
        {#if icon}
            <Icon {icon} style={children ? "margin-right: 4px" : ''}/>
        {/if}
        <Render {children}/>
        {#if !disabled}
            <Ripple {active}/>
        {/if}
    </button>
{/snippet}
{#if tooltip}
    {#if tooltip.children}
        <Paper hover mobile={false} {...tooltip} target={button}/>
    {:else}
        <Paper tl hover mobile={false} target={button} children={tooltip}/>
    {/if}
{:else}
    {@render button()}
{/if}

<style lang="scss">
  button {
    -webkit-appearance: none;
    background: var(--theme);
    color: var(--on-theme);
    border: none;
    padding: calc(10px - var(--border, 0px)) calc(20px - var(--border, 0px));
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s, box-shadow 0.3s, color 0.3s;

    &.small {
      padding: calc(5px - var(--border, 0px)) calc(10px - var(--border, 0px));
      font-size: 0.8rem;
    }

    &.large {
      padding: calc(15px - var(--border, 0px)) calc(30px - var(--border, 0px));
      font-size: 1.2rem;
    }

    &.round {
      border-radius: 1000px;
    }

    &.raised:not(:active) {
      box-shadow: color-mix(in srgb, var(--on-surface), transparent 80%) 0 2px 5px 0;
    }

    &:not(.transparent):not(.outlined):hover:not(:active) {
      box-shadow: color-mix(in srgb, var(--on-surface), transparent 70%) 0 4px 8px 0;
    }

    &:active {
      box-shadow: none;
    }

    &.full {
      display: block;
      width: 100%;
    }

    &.outlined {
      --on-theme: var(--theme);
      background: transparent;
      color: var(--theme);
      border: 1px solid var(--theme);
      --border: 1px;
    }

    &.transparent {
      --on-theme: var(--theme);
      background: transparent;
      color: var(--theme);
    }
  }
</style>