<script lang="ts">
    import {
        Button,
        Ripple,
        Radio,
        Input,
        CircularProgress,
        Checkbox,
        LinearProgress,
        Paper,
        IconButton,
        Expand, Select, Table
    } from "$lib/index.js";
    import {tween} from "$lib/util.svelte.js";
	import List from "../lib/list/List.svelte";

    const val = tween(0.5);

    let flag = $state(0);
    let outlined = $derived(flag % 2 === 0);
    let transparent = $derived(flag % 2 === 0);
    $effect(() => {
        //val.value = [0, 1, -1][flag % 3]
    })
</script>


<Table stickyLeft stickyTop>
    {#snippet header()}
        <tr>
            {#each {length: 4} as _}
                <th>12345</th>
            {/each}
        </tr>
    {/snippet}
    <tbody>
    {#each {length: 100} as _}
        <tr>
            {#each {length: 4} as _}
                <td>123</td>
            {/each}
        </tr>
    {/each}
    </tbody>
</Table>
<div style="width:500px;height:500px;max-width: 100vw;border: 1px solid var(--primary-light2);border-radius: 12px">
    <Ripple active/>
</div>
<Button icon="favorite" {outlined} onclick={() => flag++}>sdfsdfsdf</Button>
<Button icon="star" secondary {transparent} onclick={() => flag++} tooltip={{tr: true, children: 'test'}}>sdfsdfsdf
</Button>
<Button icon="star" secondary small outlined active={flag % 2} onclick={() => flag++}>sdfsdfsdf</Button>
<Button icon="star" secondary raised={flag % 2} onclick={() => flag++}>sdfsdfsdf</Button>
<Button light-5 icon="star" secondary large onclick={() => flag++}>sdfsdfsdf</Button>
<Button icon="star" secondary round onclick={() => flag++}>sdfsdfsdf</Button>
<Button icon="star" secondary round onclick={() => flag++}/>
<LinearProgress progress={val.value} indeterminate={flag % 2}/>
<LinearProgress progress={val.value} indeterminate={flag % 2 === 0} secondary/>
<IconButton icon="favorite" label="즐겨찾기" flat size="30" onclick={() => flag++} active={flag % 2}/>
<IconButton icon="favorite" tooltip="테스트" onclick={() => flag++} active={flag % 2}/>
<Paper tl>
    {#snippet target()}
        <Button icon="favorite" tooltip="안녕">sdfsdfsdf</Button>
    {/snippet}
    {#each {length: 100} as _}
        sdfsdfdssdfasfasdfasdfasfasddfasd<br>
    {/each}
</Paper>
<Paper bl inlineBlock>
    {#snippet target()}
        <Button icon="login">Join</Button>
    {/snippet}
    <main>
        <h2>Welcome!</h2>
        <p>
            To continue, you should agree to our
            <Paper br mobile>
                {#snippet target()}
                    <span style="text-decoration: underline">Term of service.</span>
                {/snippet}
                <h1>Term of service</h1>
                {#each {length: 100} as _}
                    sdfsdfdssdfasfasdfasdfasfasddfasd<br>
                {/each}
            </Paper>
        </p>
        <Button icon="login" full>Join</Button>
    </main>
</Paper>
<Paper mr inlineBlock hover>
    {#snippet target()}
        <Button icon="favorite">sdfsdfsdf</Button>
    {/snippet}
    sdfsdfdssdfasfasdfasdfasfasddfasd<br>
    sdfsdfdssdfasfasdfasdfasfasddfasd<br>
    sdfsdfdssdfasfasdfasdfasfasddfasd<br>
</Paper>
<Paper mr inlineBlock dense>
    {#snippet target()}
        <Button icon="menu">List</Button>
    {/snippet}
    <List list={[{title: 'test', onclick: () => flag++}, {title: 'test2', icon: 'star', onclick: () => flag++}, {title: 'test3', onclick: () => flag++}]}/>
</Paper>
<br>
<Radio label="test" value={0} name="test" bind:selected={flag}/>
<Radio secondary label="test2" value={1} name="test" bind:selected={flag}/>
<Checkbox label="test" bind:checked={flag}/>
<Checkbox secondary label="test2" bind:checked={flag}/>
<br>

<CircularProgress progress={0.7} indeterminate={flag % 2}/>
<CircularProgress secondary progress={0.7} indeterminate={flag % 2}/>

<Input bind:value={flag} placeholder="test" leading="search"
       trailing={{icon: 'close', onclick: () => flag = 0, tooltip: '초기화'}}/>
<Input bind:value={flag} placeholder="value" type="number"
       trailing="restart_alt"/>
<br>
<Input multiline bind:value={flag} placeholder="test"/>
<Select placeholder="테스트"></Select>

<Expand hide={flag % 2 === 1}>
    fsasdfasfasfasdfsad<br>
    fsasdfasfasfasdfsad<br>
    fsasdfasfasfasdfsad<br>
</Expand>
<!--<Input type="password" bind:value={flag}/>-->