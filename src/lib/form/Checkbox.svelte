<script context="module">
    let counter = 0

    function getCounter() {
        return `nunui-checkbox-${counter++}`
    }
</script>

<script lang="ts">
    import {Render, Ripple} from "$lib";

    let {
        name,
        secondary,
        primary = !secondary,
        label,
        id: _id,
        value,
        checked = $bindable(false),
    } = $props()

    let id = $derived(_id || getCounter())
    let target = $state(null)
    let container = $state(null)
</script>

<main bind:this={container} class:primary class:secondary>
    <div>
        <Ripple extra={container} center/>
        <input {id} type="checkbox" {name} {value} bind:this={target} bind:checked/>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
            <rect class="short" height="5.6px" width="2px"></rect>
            <rect class="long" width="10.6px" height="2px"></rect>
        </svg>
    </div>
    {#if label}
        <label for={id}>
            <Render it={label}/>
        </label>
    {/if}
</main>

<style lang="scss">
  @keyframes short-intro {
    0% {
      transform: scaleY(-1) translate(7px, -14px) rotate(45deg) scaleY(0);
    }

    100% {
      transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
    }
  }

  @keyframes long-intro {
    0% {
      transform: scaleY(-1) translate(7px, -14px) rotate(45deg) scaleX(0);
    }

    100% {
      transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
    }
  }

  * {
    cursor: pointer;
  }

  svg {
    position: absolute;
    margin: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    pointer-events: none;
    left: 0;
  }

  rect {
    transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
    fill: var(--r-on-theme);
    opacity: 0;

    input:checked ~ svg > & {
      opacity: 1;

      &.short {
        animation: short-intro 0.2s;
      }

      &.long {
        animation: long-intro 0.2s;
      }
    }
  }

  main {
    display: inline-block;
    --r-on-theme: var(--on-theme);

    > * {
      --on-theme: var(--theme);
    }
  }

  div {
    display: inline-block;
    border-radius: 100px;
    width: 1.75em;
    height: 1.75em;
    position: relative;
    vertical-align: middle;
  }

  label {
    vertical-align: middle;
  }

  input {
    -webkit-appearance: none;
    padding: 0;
    margin: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    border-radius: 2px;
    outline: none;
    position: relative;

    &:before {
      content: "";
      border: solid 2px color-mix(in srgb, var(--on-surface), var(--surface) 30%);
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 2px;
      transition: border-color 0.2s;
    }

    &:after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background: var(--theme);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:checked {
      &:before {
        border-color: var(--theme);
      }

      &:after {
        opacity: 1;
      }
    }
  }
</style>