<script lang="ts">
    import {Button, ThemeProvider} from "$lib";

    const defaultLight = {
        primary: '#6200EE',
        secondary: '#03DAC6',
        surface: '#FFFFFF',
        onPrimary: '#FFFFFF',
        onSecondary: '#000000',
        onSurface: '#000000',
    }

    const defaultDark = {
        primary: '#BB86FC',
        secondary: '#03DAC6',
        surface: '#121212',
        onPrimary: '#000000',
        onSecondary: '#000000',
        onSurface: '#FFFFFF',
    }

    let {
        children
    } = $props();

    let mobile = $state(false);
    let dark = $state(false);
</script>

<Button onclick={() => dark = !dark} icon="dark_mode">테마</Button>
<ThemeProvider {...dark ? defaultDark : defaultLight} {mobile} {children}/>
