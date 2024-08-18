<script context="module">
    let counter = 0

    function getCounter() {
        return `nunui-radio-${counter++}`
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
        selected = $bindable(null),
    } = $props()

    let id = $derived(_id || getCounter())
    let target = $state(null)
    let container = $state(null)
</script>

<main bind:this={container} class:primary class:secondary>
    <div>
        <Ripple extra={container} center/>
        <input {id} type="radio" {name} {value} bind:this={target} bind:group={selected}/>
    </div>
    {#if label}
        <label for={id}>
            <Render it={label}/>
        </label>
    {/if}
</main>

<style lang="scss">
  * {
    cursor: pointer;
  }

  main {
    display: inline-block;
    --on-theme: var(--theme);
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
    margin: 6px;
    padding: 0;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    border-radius: 100px;
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
      border-radius: 100px;
      transition: border-color 0.2s;
    }

    &:after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--theme);
      transform: scale(0);
      transition: transform 0.2s;
    }

    &:checked {
      &:before {
        border-color: var(--theme);
      }

      &:after {
        transform: scale(0.5);
      }
    }
  }
</style>