<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    interface CircularProgressProps extends HTMLAttributes<SVGElement> {
        progress?: number;
        indeterminate?: boolean;
        secondary?: boolean;
        primary?: boolean;
        color?: string;
        size?: string | number;
    }

    let {
        progress: _progress = 0,
        indeterminate: _indeterminate = false,
        secondary = false,
        primary = !secondary,
        color = '',
        size = '1em',
        ...rest
    }: CircularProgressProps = $props();

    let start = $state(false);
    let stop = $state(false);
    let indeterminate = $derived(_progress < 0 || _indeterminate);
    let lastIndeterminate = $state(_progress < 0 || _indeterminate);

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

    let progress = $derived(stop ? 1 : (start ? 0 : _progress));
</script>

<svg style:--size="{typeof size === 'number' ? `${size}px` : size}" width="35px" height="35px" viewBox="0 0 70 70"
     xmlns="http://www.w3.org/2000/svg" class:primary class:secondary {...rest}>
    <circle class="rail" fill="none" stroke-width="4" stroke-linecap="round" cx="35" cy="35" r="30"
            style:stroke={color}></circle>
    {#if indeterminate || lastIndeterminate}
        <g class:exit={start}>
            <g class="spinner indeterminate">
                <circle class="circle indeterminate" fill="none" stroke-width="8"
                        stroke-linecap="round" cx="35" cy="35" r="30"></circle>
            </g>
        </g>
    {/if}
    {#if !indeterminate || !lastIndeterminate}
        <g class:exit={stop}>
            <g class="spinner determinate">
                <circle class="circle determinate" fill="none" stroke-width="8"
                        stroke-linecap="round" cx="35" cy="35" r="30" style:--progress={progress * 188.49}></circle>
            </g>
        </g>
    {/if}
</svg>

<style lang="scss">
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: var(--i-op);
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: var(--i-op);
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes scaleIn {
    0% {
      transform: scale(var(--i-sc));
    }
    100% {
      transform: scale(1);
    }
  }

  .spinner {
    transform-origin: center;
    transform: rotate(-90deg);

    &.indeterminate {
      animation: rotation 1.35s linear infinite;
    }
  }

  .circle {
    stroke-dasharray: 180;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: var(--theme);

    &.indeterminate {
      animation: turn 1.35s ease-in-out infinite;
    }

    &.determinate {
      stroke-dashoffset: 329.87;
      stroke-dasharray: var(--progress) calc(329.87 - var(--progress));
      transition: all 0.35s ease-in-out;
    }
  }

  .exit {
    --i-op: 1;
    -moz-animation: fadeOut 0.6s forwards;
    -webkit-animation: fadeOut 0.6s forwards;
    -o-animation: fadeOut 0.6s forwards;
    animation: fadeOut 0.6s forwards;
  }

  .rail {
    stroke: var(--theme-light3);
  }

  @keyframes rotation {
    0% {
      transform: rotate(-90deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes turn {
    0% {
      stroke-dashoffset: 180;
    }
    50% {
      stroke-dashoffset: 45;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 180;
      transform: rotate(450deg);
    }
  }
</style>
