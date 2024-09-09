<script lang="ts">
    import {delayedToggle} from "$lib/util.svelte.js";
    import {Render} from "$lib/index.js";
    import {flushSync} from "svelte";

    let {
        children,
        hide = false,
        initial = false,
    } = $props();

    let clientHeight = $state(0), height = $state(0);
    let active = $state(initial);
    let render = delayedToggle(!hide, 0);

    $effect(() => {
        render.v = !hide;
        flushSync();
        height = hide ? 0 : clientHeight;
        flushSync();
        active = true;
    })
</script>

<main style:--height="{height}px" class:active>
    {#if render.v}
        <div bind:clientHeight>
            <Render {children}/>
        </div>
    {/if}
</main>

<style lang="scss">
  main {
    overflow: hidden;
    position: relative;

    &.active {
      transition: height 0.2s;
      height: var(--height);

      div {
        position: absolute;
      }
    }
  }
</style>