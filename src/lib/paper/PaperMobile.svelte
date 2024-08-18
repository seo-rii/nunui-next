<script lang="ts">
    import {Render} from "$lib";
    import {on} from "svelte/events";

    let {
        children,
        show = $bindable(false),

        ...rest
    } = $props();

    let container = $state(null);
    let delta = $state(0), dx = $state(0);
    let tr = $derived(delta || dx);

    $effect(() => {
        let from = 0, fx = 0, run = false;
        const handlers = [
            on(container, "touchstart", (e) => {
                e.stopPropagation();
                const {clientY, clientX} = e.touches[0];
                const {top, left} = container.getBoundingClientRect();
                from = clientY - top;
                fx = clientX - left;
                run = true;
            }),
            on(container, "touchmove", (e) => {
                e.stopPropagation();
                if (!run) return;
                if (container.scrollTop > 0) {
                    run = false;
                    return;
                }
                const {clientY, clientX} = e.touches[0];
                const {top, left} = container.getBoundingClientRect();
                if (delta + clientY - top - from > 0) e.preventDefault();
                delta = Math.max(0, delta + clientY - top - from);
                dx = dx + clientX - left - fx;
            }),
            on(container, "touchend", (e) => {
                e.stopPropagation();
                run = false;
                if (delta > 100) show = false;
                else {
                    const ret = () => {
                        delta *= 0.8;
                        dx *= 0.86;
                        if (dx < 0.1) dx = 0;
                        if (delta < 1) delta = 0;
                        if (delta || dx) requestAnimationFrame(ret);
                    }
                    requestAnimationFrame(ret);
                }
            })
        ]
        return () => handlers.forEach((h) => h());
    })

    const vx = $derived(dx > 0 ? Math.pow(dx, 0.5) : -Math.pow(-dx, 0.5));
</script>

<div class="scrim" class:show></div>
<main {...rest} class:hide={!show} bind:this={container} style:--delta="{delta}px" style:--dx="{vx}px" class:tr>
    <div class="line">
        <div class="handle"></div>
    </div>
    <Render {children}/>
</main>

<style lang="scss">
  .scrim {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s;
    animation: fade 0.2s;

    &.show {
      opacity: 1;
    }
  }

  .line {
    width: 100%;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 0;
    background: var(--surface);

    .handle {
      height: 4px;
      width: 48px;
      border-radius: 2px;
      background: var(--on-surface);
      opacity: 0.5;
    }
  }

  main {
    box-shadow: 0 0 10px color-mix(in srgb, var(--on-surface) 16%, transparent);
    background: var(--surface);
    animation: show 0.15s cubic-bezier(0, .75, .25, 1);
    position: fixed;
    bottom: 12px;
    left: 12px;
    right: 12px;
    max-height: calc(100% - 24px);
    border-radius: 12px;
    z-index: 3;
    overflow-y: auto;
    overscroll-behavior: contain;

    &.tr {
      transform: translate(var(--dx), var(--delta));
    }

    &.hide {
      animation: hide 0.2s cubic-bezier(1, 0, .67, 1) forwards;
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes show {
    from {
      transform: translate(0, 100%);
    }
    to {
      transform: translate(var(--dx), 0);
    }
  }

  @keyframes hide {
    from {
      transform: translate(var(--dx), var(--delta));
    }
    to {
      transform: translate(0, 100%);
    }
  }
</style>