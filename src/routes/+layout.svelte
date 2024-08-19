<script lang="ts">
    import {ThemeProvider} from "$lib";
    import {browser} from "$app/environment";

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

<ThemeProvider {...dark ? defaultDark : defaultLight} {mobile} {children}/>
