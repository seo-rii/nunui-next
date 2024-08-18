<script lang="ts">
    import PaperDesktop from "$lib/paper/PaperDesktop.svelte";
    import {getContext} from "svelte";
    import {delayedToggle, hovering} from "$lib/util.svelte.js";
    import {Render} from "$lib";
    import PaperMobile from "$lib/paper/PaperMobile.svelte";

    const mobile = getContext('mobile')
    let {
        children,
        target,

        block,
        inlineBlock = !block,
        tl, tc, tr, ml, mr, bl, bc, br,
        show: _show = $bindable(false),
        mobile: _mobile,
        dense = false,

        hover: _hover = false,
        by = _hover ? "hover" : "click",
    } = $props();

    let useMobile = $derived(_mobile === undefined ? mobile.v : _mobile);
    let hover = delayedToggle(false);
    let show = $state(_show);
    let iv = 0, ig = false;

    $effect(() => {
        if (by === "hover") _show = hover.v
    })

    $effect(() => {
        if (_show) show = true
        else {
            if (iv) clearTimeout(iv)
            iv = setTimeout(() => show = false, 200)
        }
    })

    $effect(() => {
        const handler = (e) => {
            if (ig) ig = false
            else _show = false
        }
        window.addEventListener("click", handler)
        return () => window.removeEventListener("click", handler)
    })
</script>

<main class:inlineBlock class:block onclick={() => {
    if(ig) return
    ig = true
    _show = !_show
}} use:hovering={hover}>
    <Render it={target}/>
    {#if show}
        {#if useMobile}
            <PaperMobile bind:show={_show} onclick={() => ig = true}>
                <div class="mobile" class:dense>
                    <Render {children}/>
                </div>
            </PaperMobile>
        {:else}
            <PaperDesktop bind:show={_show} onclick={() => ig = true} {tl} {tc} {tr} {ml} {mr} {bl} {bc} {br}>
                <div class="desktop" class:dense>
                    <Render {children}/>
                </div>
            </PaperDesktop>
        {/if}
    {/if}
</main>

<style lang="scss">
  main {
    position: relative;

    &.block {
      display: block;
    }

    &.inlineBlock {
      display: inline-block;
    }
  }

  .desktop {
    padding: 4px;
  }

  .mobile {
    padding: 12px;
  }

  .dense {
    padding: 0;
  }
</style>