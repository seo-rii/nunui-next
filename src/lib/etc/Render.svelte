<script lang="ts">
    let {
        children = null as any,
        it = null as any,
    } = $props();

    let target = $derived(children || it);
</script>

{#if typeof target === "string" || typeof target === "number"}
    {target}
{:else if !(target === null || target === undefined || target === false)}
    {@render target?.()}
{/if}
