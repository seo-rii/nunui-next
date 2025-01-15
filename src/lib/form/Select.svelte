<script lang="ts">
	import { Input, Paper } from '$lib/index.js';

	let { placeholder = '' } = $props();
</script>

<Paper>
	{#snippet target()}
		<Input {placeholder} />
	{/snippet}
	sdfsdfsdfsdfsdf
</Paper>
