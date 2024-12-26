<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    interface LinearProgressProps extends HTMLAttributes<HTMLDivElement> {
        progress?: number;
        indeterminate?: boolean;
        secondary?: boolean;
        primary?: boolean;
        color?: string;
        width?: string | number;
    }

    let {
        progress: _progress = 0,
        width = "100%",
        style: _style = "",
        indeterminate: _indeterminate = false,
        secondary = false,
        primary = !secondary,
        color: background = '',
    }: LinearProgressProps = $props()

    let start = $state(false), stop = $state(false)
    let indeterminate = $derived(_progress < 0 || _indeterminate)
    let lastIndeterminate = $state(_progress < 0 || _indeterminate)

    let style = $derived(`width: ${width}; ${_style}`);

    $effect(() => {
        if (indeterminate !== lastIndeterminate) {
            if (!indeterminate) {
                start = true;
                setTimeout(() => {
                    start = false;
                    lastIndeterminate = indeterminate;
                }, 200);
            } else {
                stop = true;
                setTimeout(() => {
                    stop = false;
                    lastIndeterminate = indeterminate;
                }, 200);
            }
        }
    });

    let progress = $derived(stop ? 1 : (start ? 0 : _progress))
</script>

<main {style} class:primary class:secondary>
    <div class="line"></div>
    {#if indeterminate || lastIndeterminate}
        <div class="indicator ind-1" class:exit={start} style:background></div>
        <div class="indicator ind-2" class:exit={start} style:background></div>
    {/if}
    {#if !indeterminate || !lastIndeterminate}
        <div class="indicator" style:background style:width="{progress * 100 || 0}%" class:exit={stop}></div>
    {/if}
</main>

<style lang="scss">
  main {
    border-radius: 100px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    height: 8px;
  }

  .line {
    background: var(--theme);
    opacity: 0.2;
    border-radius: 100px;
    position: absolute;
    top: 3px;
    height: 2px;
    width: 100%;
  }

  .indicator {
    background: var(--theme);
    position: absolute;
    left: 0;
    border-radius: 5px;
    transition: all 0.3s ease;
    height: 6px;
    top: 1px;
  }

  .ind-1 {
    animation: ind-1 3s ease-in infinite;
  }

  .ind-2 {
    animation: ind-2 3s ease-out infinite;
  }

  .exit {
    animation: fadeOut 0.2s ease;
  }

  @keyframes ind-1 {
    0% {
      left: 0;
      width: 0;
    }

    65% {
      transform: translateX(68%);
      width: 150%;
    }

    100% {
      transform: translateX(68%);
      width: 150%;
    }
  }

  @keyframes ind-2 {
    0% {
      left: -150%;
      width: 150%;
    }

    55% {
      left: -150%;
      width: 150%;
    }

    90% {
      left: 100%;
      width: 9%;
    }

    100% {
      left: 100%;
      width: 9%;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
