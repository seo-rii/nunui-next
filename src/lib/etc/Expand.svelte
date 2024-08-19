<script lang="ts">
    import {delayedToggle} from "$lib/util.svelte.js";
    import {Render} from "$lib";

    let {
        children,
        hide = false,
    } = $props();

    let render = delayedToggle(!hide, 0);
    let clientHeight = $state(0), height = $state(0);

    $effect(() => {
        render.v = !!height;
    })

    $effect(() => {
        height = hide ? 0 : clientHeight;
    })
</script>

<main style:height="{height}px">
    {#if render.v}
        <div bind:clientHeight>
            <Render {children}/>
        </div>
    {/if}
</main>

<style lang="scss">
  main {
    overflow: hidden;
    transition: height 0.2s;
    position: relative;
  }

  div {
    position: absolute;
  }
</style>