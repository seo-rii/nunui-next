<script lang="ts">
    let {
        children,
        show = $bindable(false),

        tl, tc, tr, ml, mr, bl, bc, br,
        ...rest
    } = $props();
</script>

<main class:exit={!show} {...rest} class:tl class:tc class:tr class:ml class:mr class:bl class:bc class:br>
    {@render children()}
</main>

<style lang="scss">
  main {
    box-shadow: 0 0 10px color-mix(in srgb, var(--on-surface) 16%, transparent);
    background: var(--surface);
    animation: show 0.15s cubic-bezier(0, .75, .25, 1);
    width: max-content;
    position: absolute;
    border-radius: 12px;
    --transform: translate(0, 0);

    z-index: var(--paper-z-index, 3);

    &.exit {
      animation: hide 0.2s cubic-bezier(1, 0, .67, 1) forwards;
    }

    &.tl {
      bottom: calc(100% + 4px);
      left: 0;
      transform-origin: bottom left;
    }

    &.tc {
      bottom: calc(100% + 4px);
      left: 50%;
      --transform: translateX(-50%);
      transform: translateX(-50%);
      transform-origin: bottom center;
    }

    &.tr {
      bottom: calc(100% + 4px);
      right: 0;
      transform-origin: bottom right;
    }

    &.ml {
      bottom: 50%;
      right: calc(100% + 4px);
      --transform: translateY(50%);
      transform: translateY(50%);
      transform-origin: center right;
    }

    &.mr {
      bottom: 50%;
      left: calc(100% + 4px);
      --transform: translateY(50%);
      transform: translateY(50%);
      transform-origin: center left;
    }

    &.bl {
      top: calc(100% + 4px);
      left: 0;
      transform-origin: top left;
    }

    &.bc {
      top: calc(100% + 4px);
      left: 50%;
      --transform: translateX(-50%);
      transform: translateX(-50%);
      transform-origin: top center;
    }

    &.br {
      top: calc(100% + 4px);
      right: 0;
      transform-origin: top right;
    }
  }

  @keyframes show {
    from {
      opacity: 0;
      transform: scale(0.85) var(--transform);
    }
    to {
      opacity: 1;
      transform: scale(1) var(--transform);
    }
  }

  @keyframes hide {
    from {
      opacity: 1;
      transform: scale(1) var(--transform);
    }
    to {
      opacity: 0;
      transform: scale(0.8) var(--transform);
    }
  }
</style>