<script lang="ts">
	import type { SelectOption } from '$lib/form/Select.svelte';
	import {
		Button,
		Ripple,
		Icon,
		Radio,
		Input,
		CircularProgress,
		Checkbox,
		LinearProgress,
		LoadingIndicator,
		Paper,
		IconButton,
		Expand,
		Select,
		SelectBody,
		SegmentButton,
		Table,
		List,
		addSnackbar,
		addDialog
	} from '$lib/index.js';
	import { tween } from '$lib/util.svelte.js';

	type DemoSelectValue = string | number | boolean | null;

	const val = tween(0.5);
	const selectDemoOptions = [
		{ value: 'today', label: '오늘', subtitle: 'Today', icon: 'today' },
		{ value: 'week', label: '이번 주', subtitle: 'This week', icon: 'date_range' },
		{ value: 'month', label: '이번 달', subtitle: 'This month', icon: 'calendar_month' }
	];
	const segmentDemoOptions = [
		{ value: 'list', label: '목록', icon: 'view_list' },
		{ value: 'grid', label: '그리드', icon: 'grid_view' },
		{ value: 'compact', label: '컴팩트' }
	];

	let flag = $state(0);
	let selectValue = $state<string | undefined>(undefined);
	let selectBodyValue = $state<DemoSelectValue | undefined>('today');
	let segmentValue = $state<'list' | 'grid' | 'compact'>('list');
	let outlined = $derived(flag % 2 === 0);
	let transparent = $derived(flag % 2 === 0);
	$effect(() => {
		//val.value = [0, 1, -1][flag % 3]
	});
</script>

<Table stickyLeft stickyTop>
	{#snippet header()}
		<tr>
			{#each { length: 4 } as _}
				<th>12345</th>
			{/each}
		</tr>
	{/snippet}
	<tbody>
		{#each { length: 0 } as _}
			<tr>
				{#each { length: 4 } as _}
					<td>123</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</Table>
<div
	style="width:500px;height:500px;max-width: 100vw;border: 1px solid var(--primary-light2);border-radius: 12px"
>
	<Ripple active />
</div>
<Button icon="favorite" {outlined} onclick={() => flag++}>sdfsdfsdf</Button>
<Button
	icon="star"
	secondary
	{transparent}
	onclick={() => flag++}
	tooltip={{ tr: true, children: 'test' }}
	loading={flag % 2 === 1}
	>sdfsdfsdf
</Button>
<Button icon="star" secondary small outlined active={flag % 2 === 1} onclick={() => flag++} loading
	>sdfsdfsdf</Button
>
<Button icon="star" secondary raised={flag % 2 === 1} onclick={() => flag++}>sdfsdfsdf</Button>
<Button light-5 icon="star" secondary large onclick={() => flag++}>sdfsdfsdf</Button>
<Button icon="star" secondary round onclick={() => flag++}>sdfsdfsdf</Button>
<Button
	icon="star"
	secondary
	round
	onclick={() =>
		addSnackbar({
			icon: 'favorite',
			text: '테스트 스낵바입니다.',
			actions: [{ text: '확인', onclick: () => alert(1) }]
		})}>Snackbar</Button
>
<Button
	icon="star"
	secondary
	round
	onclick={() =>
		addDialog({
			icon: 'favorite',
			title: '다이얼로그',
			text: '테스트 다이얼로그 입니다.',
			actions: [{ text: '확인', onclick: () => alert(1) }]
		})}>Dialog</Button
>

<Button icon="star" secondary round disabled>dsfs</Button>
<LinearProgress progress={val.value} indeterminate={flag % 2 === 1} />
<LinearProgress progress={val.value} indeterminate={flag % 2 === 0} secondary />
<LinearProgress progress={val.value} indeterminate={flag % 2 === 1} appearance="wavy" />
<LinearProgress progress={val.value} indeterminate={flag % 2 === 0} secondary appearance="wavy" />
<LinearProgress variant="m3" progress={val.value} indeterminate={flag % 2 === 1} />
<LoadingIndicator />
<LoadingIndicator secondary variant="contained" />
<IconButton
	icon="favorite"
	label="즐겨찾기"
	flat
	size="30"
	onclick={() => flag++}
	active={flag % 2 === 1}
/>
<IconButton icon="favorite" tooltip="테스트" onclick={() => flag++} active={flag % 2 === 1} />
<IconButton icon="favorite" active={flag % 2 === 1} disabled />
<SegmentButton options={segmentDemoOptions} bind:value={segmentValue} />
<SegmentButton small options={segmentDemoOptions} bind:value={segmentValue} />
<SegmentButton secondary variant="m3" options={segmentDemoOptions} bind:value={segmentValue} />
<Paper tl>
	{#snippet target()}
		<Button icon="favorite" tooltip="안녕">sdfsdfsdf</Button>
	{/snippet}
	{#each { length: 100 } as _}
		sdfsdfdssdfasfasdfasdfasfasddfasd<br />
	{/each}
</Paper>
<Paper bl inlineBlock remap>
	{#snippet target()}
		<Button icon="login">Join</Button>
	{/snippet}
	<main>
		<h2>Welcome!</h2>
		<p>
			To continue, you should agree to our
			<Paper br mobile remap>
				{#snippet target()}
					<span style="text-decoration: underline">Term of service.</span>
				{/snippet}
				<h1>Term of service</h1>
				{#each { length: 100 } as _}
					sdfsdfdssdfasfasdfasdfasfasddfasd<br />
				{/each}
			</Paper>
		</p>
		<Button icon="login" full>Join</Button>
	</main>
</Paper>
<Paper mr inlineBlock hover remap>
	{#snippet target()}
		<Button icon="favorite">sdfsdfsdf</Button>
	{/snippet}
	sdfsdfdssdfasfasdfasdfasfasddfasd<br />
	sdfsdfdssdfasfasdfasdfasfasddfasd<br />
	sdfsdfdssdfasfasdfasdfasfasddfasd<br />
</Paper>
<Paper mr inlineBlock dense>
	{#snippet target()}
		<Button icon="menu">List</Button>
	{/snippet}
	<List
		list={[
			{ title: 'test', onclick: () => flag++ },
			{ title: 'test2', icon: 'star', onclick: () => flag++ },
			{ title: 'test3', onclick: () => flag++ }
		]}
	/>
</Paper>
<br />
<Radio label="test" value={0} name="test" bind:selected={flag} />
<Radio secondary label="test2" value={1} name="test" bind:selected={flag} />
<Checkbox label="test" bind:checked={flag as any} />
<Checkbox secondary label="test2" bind:checked={flag as any} />
<br />

<CircularProgress progress={0.7} indeterminate={flag % 2 === 1} />
<CircularProgress secondary progress={0.7} indeterminate={flag % 2 === 1} />
<CircularProgress progress={0.7} indeterminate={flag % 2 === 1} appearance="wavy" />
<CircularProgress secondary progress={0.7} indeterminate={flag % 2 === 1} appearance="wavy" />
<CircularProgress variant="m3" progress={0.7} indeterminate={flag % 2 === 1} />

<Input
	bind:value={flag}
	placeholder="test"
	leading="search"
	trailing={{ icon: 'close', onclick: () => (flag = 0), tooltip: '초기화' }}
/>
<div style="width: 200px">
	<Input bind:value={flag} placeholder="value" type="number" block trailing="restart_alt" />
</div>
<br />
<Input multiline bind:value={flag} placeholder="test" plain autosize />
<Select placeholder="테스트"></Select>
<div style="width: 280px">
	<Select
		placeholder="기본 표시 (snippet nullish)"
		search
		options={selectDemoOptions}
		bind:value={selectValue}
	/>
</div>
{#snippet selectDisplaySnippet(
	option: SelectOption | undefined,
	currentValue: DemoSelectValue | undefined
)}
	{#if option}
		<span
			class="select-custom-display"
			title={currentValue === undefined ? undefined : String(currentValue)}
		>
			{#if option.icon}
				<Icon icon={option.icon} size={16} style="opacity:0.8;transform:translateY(1px);" />
			{/if}
			<span>{option.label}</span>
		</span>
	{/if}
{/snippet}
<div style="width: 280px">
	<Select
		placeholder="snippet 커스텀 표시"
		search
		options={selectDemoOptions}
		bind:value={selectValue}
		snippet={selectDisplaySnippet}
	/>
</div>
{#snippet selectTriggerSnippet(
	option: SelectOption | undefined,
	currentValue: DemoSelectValue | undefined,
	open: boolean
)}
	<Button
		secondary
		outlined
		full
		icon={option?.icon || 'filter_alt'}
		active={open}
		style="justify-content: space-between;"
	>
		<span class="select-trigger-main">{option ? option.label : '필터 선택'}</span>
		<span class="select-trigger-state">
			{open ? '열림' : currentValue === undefined ? '미선택' : String(currentValue)}
		</span>
	</Button>
{/snippet}
<div style="width: 280px">
	<Select
		placeholder="트리거 교체 (버튼 snippet)"
		search
		options={selectDemoOptions}
		bind:value={selectValue}
		triggerSnippet={selectTriggerSnippet}
	/>
</div>
<div style="width: 280px">
	<Paper dense remap style="display: block;">
		<SelectBody
			search
			options={selectDemoOptions}
			searchPlaceholder="기간 검색"
			bind:value={selectBodyValue}
			ariaLabel="기간 선택 목록"
		/>
	</Paper>
</div>
<div>Body 선택값: {selectBodyValue ?? '없음'}</div>

<Expand hide={flag % 2 === 1}>
	fsasdfasfasfasdfsad<br />
	fsasdfasfasfasdfsad<br />
	fsasdfasfasfasdfsad<br />
</Expand>

<!--<Input type="password" bind:value={flag}/>-->

<style>
	.select-custom-display {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.select-trigger-main {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}

	.select-trigger-state {
		opacity: 0.7;
		font-size: 0.82em;
	}
</style>
