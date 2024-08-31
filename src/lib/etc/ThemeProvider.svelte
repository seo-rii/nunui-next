<script lang="ts">
    import {setContext, tick} from "svelte";

    let server = $state(true), client = $state(false)

    $effect(() => {
        client = true
        tick().then(() => server = false)
    });

    let {
        children,
        primary = '#6200EE',
        secondary = '#03DAC6',
        surface = '#FFFFFF',
        onPrimary = '#FFFFFF',
        onSecondary = '#000000',
        onSurface = '#000000',
        mobile = false,
        local = false,
    } = $props();

    const style = $derived(`
        :root {
            --theme: ${primary};
            --primary: ${primary};
            --secondary: ${secondary};
            --surface: ${surface};
            --on-primary: ${onPrimary};
            --on-theme: ${primary};
            --on-secondary: ${onSecondary};
            --on-surface: ${onSurface};
            transition: --primary 0.2s ease, --secondary 0.2s ease, --surface 0.2s ease, --on-surface 0.2s ease, --on-secondary 0.2s ease;
        }
    `);

    setContext('mobile', {
        get v() {
            return mobile;
        }
    });
</script>

<svelte:head>
    {#if server}
        {@html `<style>${style}</style>`}
    {/if}
    {#if client}
        {@html `<style>${style}</style>`}
    {/if}
    {#if !local}
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Roboto', sans-serif;
                background-color: var(--surface);
                color: var(--on-surface);
            }
        </style>
    {/if}

    <style>
        @property --primary {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        @property --secondary {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        @property --surface {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        @property --on-primary {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        @property --on-secondary {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        @property --on-surface {
            syntax: '<color>';
            initial-value: transparent;
            inherits: true;
        }

        *.primary {
            --theme: var(--primary);
            --theme-light1: var(--primary-light1);
            --theme-light2: var(--primary-light2);
            --theme-light3: var(--primary-light3);
            --theme-light4: var(--primary-light4);
            --theme-light5: var(--primary-light5);
            --theme-light6: var(--primary-light6);
            --theme-light7: var(--primary-light7);
            --theme-light8: var(--primary-light8);
            --theme-light9: var(--primary-light9);
            --theme-light10: var(--primary-light10);
            --theme-light11: var(--primary-light11);
            --theme-light12: var(--primary-light12);
            --theme-light13: var(--primary-light13);
            --theme-light14: var(--primary-light14);
            --theme-light15: var(--primary-light15);
            --theme-light16: var(--primary-light16);
            --theme-light17: var(--primary-light17);
            --theme-light18: var(--primary-light18);
            --theme-light19: var(--primary-light19);
            --theme-light20: var(--primary-light20);
            --theme-dark1: var(--primary-dark1);
            --theme-dark2: var(--primary-dark2);
            --theme-dark3: var(--primary-dark3);
            --theme-dark4: var(--primary-dark4);
            --theme-dark5: var(--primary-dark5);
            --theme-dark6: var(--primary-dark6);
            --theme-dark7: var(--primary-dark7);
            --theme-dark8: var(--primary-dark8);
            --theme-dark9: var(--primary-dark9);
            --theme-dark10: var(--primary-dark10);
            --theme-dark11: var(--primary-dark11);
            --theme-dark12: var(--primary-dark12);
            --theme-dark13: var(--primary-dark13);
            --theme-dark14: var(--primary-dark14);
            --theme-dark15: var(--primary-dark15);
            --theme-dark16: var(--primary-dark16);
            --theme-dark17: var(--primary-dark17);
            --theme-dark18: var(--primary-dark18);
            --theme-dark19: var(--primary-dark19);
            --theme-dark20: var(--primary-dark20);
            --on-theme: var(--on-primary);
        }

        *.secondary {
            --theme: var(--secondary);
            --theme-light1: var(--secondary-light1);
            --theme-light2: var(--secondary-light2);
            --theme-light3: var(--secondary-light3);
            --theme-light4: var(--secondary-light4);
            --theme-light5: var(--secondary-light5);
            --theme-light6: var(--secondary-light6);
            --theme-light7: var(--secondary-light7);
            --theme-light8: var(--secondary-light8);
            --theme-light9: var(--secondary-light9);
            --theme-light10: var(--secondary-light10);
            --theme-light11: var(--secondary-light11);
            --theme-light12: var(--secondary-light12);
            --theme-light13: var(--secondary-light13);
            --theme-light14: var(--secondary-light14);
            --theme-light15: var(--secondary-light15);
            --theme-light16: var(--secondary-light16);
            --theme-light17: var(--secondary-light17);
            --theme-light18: var(--secondary-light18);
            --theme-light19: var(--secondary-light19);
            --theme-light20: var(--secondary-light20);
            --theme-dark1: var(--secondary-dark1);
            --theme-dark2: var(--secondary-dark2);
            --theme-dark3: var(--secondary-dark3);
            --theme-dark4: var(--secondary-dark4);
            --theme-dark5: var(--secondary-dark5);
            --theme-dark6: var(--secondary-dark6);
            --theme-dark7: var(--secondary-dark7);
            --theme-dark8: var(--secondary-dark8);
            --theme-dark9: var(--secondary-dark9);
            --theme-dark10: var(--secondary-dark10);
            --theme-dark11: var(--secondary-dark11);
            --theme-dark12: var(--secondary-dark12);
            --theme-dark13: var(--secondary-dark13);
            --theme-dark14: var(--secondary-dark14);
            --theme-dark15: var(--secondary-dark15);
            --theme-dark16: var(--secondary-dark16);
            --theme-dark17: var(--secondary-dark17);
            --theme-dark18: var(--secondary-dark18);
            --theme-dark19: var(--secondary-dark19);
            --theme-dark20: var(--secondary-dark20);
            --on-theme: var(--on-secondary);
        }

        *.light-1 {
            --theme: var(--theme-light1);
            --on-theme: var(--on-surface);
        }

        *.light-2 {
            --theme: var(--theme-light2);
            --on-theme: var(--on-surface);
        }

        *.light-3 {
            --theme: var(--theme-light3);
            --on-theme: var(--on-surface);
        }

        *.light-4 {
            --theme: var(--theme-light4);
            --on-theme: var(--on-surface);
        }

        *.light-5 {
            --theme: var(--theme-light5);
            --on-theme: var(--on-surface);
        }

        *.light-6 {
            --theme: var(--theme-light6);
        }

        *.light-7 {
            --theme: var(--theme-light7);
        }

        *.light-8 {
            --theme: var(--theme-light8);
        }

        *.light-9 {
            --theme: var(--theme-light9);
        }

        *.light-10 {
            --theme: var(--theme-light10);
        }

        *.light-11 {
            --theme: var(--theme-light11);
        }

        *.light-12 {
            --theme: var(--theme-light12);
        }

        *.light-13 {
            --theme: var(--theme-light13);
        }

        *.light-14 {
            --theme: var(--theme-light14);
        }

        *.light-15 {
            --theme: var(--theme-light15);
        }

        *.light-16 {
            --theme: var(--theme-light16);
        }

        *.light-17 {
            --theme: var(--theme-light17);
        }

        *.light-18 {
            --theme: var(--theme-light18);
        }

        *.light-19 {
            --theme: var(--theme-light19);
        }

        *.light-20 {
            --theme: var(--theme-light20);
        }

        *.dark-1 {
            --theme: var(--theme-dark1);
        }

        *.dark-2 {
            --theme: var(--theme-dark2);
        }

        *.dark-3 {
            --theme: var(--theme-dark3);
        }

        *.dark-4 {
            --theme: var(--theme-dark4);
        }

        *.dark-5 {
            --theme: var(--theme-dark5);
        }

        *.dark-6 {
            --theme: var(--theme-dark6);
        }

        *.dark-7 {
            --theme: var(--theme-dark7);
        }

        *.dark-8 {
            --theme: var(--theme-dark8);
        }

        *.dark-9 {
            --theme: var(--theme-dark9);
        }

        *.dark-10 {
            --theme: var(--theme-dark10);
        }

        *.dark-11 {
            --theme: var(--theme-dark11);
        }

        *.dark-12 {
            --theme: var(--theme-dark12);
        }

        *.dark-13 {
            --theme: var(--theme-dark13);
        }

        *.dark-14 {
            --theme: var(--theme-dark14);
        }

        *.dark-15 {
            --theme: var(--theme-dark15);
        }

        *.dark-16 {
            --theme: var(--theme-dark16);
        }

        *.dark-17 {
            --theme: var(--theme-dark17);
        }

        *.dark-18 {
            --theme: var(--theme-dark18);
        }

        *.dark-19 {
            --theme: var(--theme-dark19);
        }

        *.dark-20 {
            --theme: var(--theme-dark20);
        }

        * {
            -webkit-tap-highlight-color: transparent;
        }

        :root {
            --primary-light1: color-mix(in srgb, var(--primary) 5%, var(--surface) 95%);
            --primary-light2: color-mix(in srgb, var(--primary) 10%, var(--surface) 90%);
            --primary-light3: color-mix(in srgb, var(--primary) 15%, var(--surface) 85%);
            --primary-light4: color-mix(in srgb, var(--primary) 20%, var(--surface) 80%);
            --primary-light5: color-mix(in srgb, var(--primary) 25%, var(--surface) 75%);
            --primary-light6: color-mix(in srgb, var(--primary) 30%, var(--surface) 70%);
            --primary-light7: color-mix(in srgb, var(--primary) 35%, var(--surface) 65%);
            --primary-light8: color-mix(in srgb, var(--primary) 40%, var(--surface) 60%);
            --primary-light9: color-mix(in srgb, var(--primary) 45%, var(--surface) 55%);
            --primary-light10: color-mix(in srgb, var(--primary) 50%, var(--surface) 50%);
            --primary-light11: color-mix(in srgb, var(--primary) 55%, var(--surface) 45%);
            --primary-light12: color-mix(in srgb, var(--primary) 60%, var(--surface) 40%);
            --primary-light13: color-mix(in srgb, var(--primary) 65%, var(--surface) 35%);
            --primary-light14: color-mix(in srgb, var(--primary) 70%, var(--surface) 30%);
            --primary-light15: color-mix(in srgb, var(--primary) 75%, var(--surface) 25%);
            --primary-light16: color-mix(in srgb, var(--primary) 80%, var(--surface) 20%);
            --primary-light17: color-mix(in srgb, var(--primary) 85%, var(--surface) 15%);
            --primary-light18: color-mix(in srgb, var(--primary) 90%, var(--surface) 10%);
            --primary-light19: color-mix(in srgb, var(--primary) 95%, var(--surface) 5%);
            --primary-light20: color-mix(in srgb, var(--primary) 100%, var(--surface) 0%);
            --primary-dark1: color-mix(in srgb, var(--primary) 5%, var(--on-surface) 95%);
            --primary-dark2: color-mix(in srgb, var(--primary) 10%, var(--on-surface) 90%);
            --primary-dark3: color-mix(in srgb, var(--primary) 15%, var(--on-surface) 85%);
            --primary-dark4: color-mix(in srgb, var(--primary) 20%, var(--on-surface) 80%);
            --primary-dark5: color-mix(in srgb, var(--primary) 25%, var(--on-surface) 75%);
            --primary-dark6: color-mix(in srgb, var(--primary) 30%, var(--on-surface) 70%);
            --primary-dark7: color-mix(in srgb, var(--primary) 35%, var(--on-surface) 65%);
            --primary-dark8: color-mix(in srgb, var(--primary) 40%, var(--on-surface) 60%);
            --primary-dark9: color-mix(in srgb, var(--primary) 45%, var(--on-surface) 55%);
            --primary-dark10: color-mix(in srgb, var(--primary) 50%, var(--on-surface) 50%);
            --primary-dark11: color-mix(in srgb, var(--primary) 55%, var(--on-surface) 45%);
            --primary-dark12: color-mix(in srgb, var(--primary) 60%, var(--on-surface) 40%);
            --primary-dark13: color-mix(in srgb, var(--primary) 65%, var(--on-surface) 35%);
            --primary-dark14: color-mix(in srgb, var(--primary) 70%, var(--on-surface) 30%);
            --primary-dark15: color-mix(in srgb, var(--primary) 75%, var(--on-surface) 25%);
            --primary-dark16: color-mix(in srgb, var(--primary) 80%, var(--on-surface) 20%);
            --primary-dark17: color-mix(in srgb, var(--primary) 85%, var(--on-surface) 15%);
            --primary-dark18: color-mix(in srgb, var(--primary) 90%, var(--on-surface) 10%);
            --primary-dark19: color-mix(in srgb, var(--primary) 95%, var(--on-surface) 5%);
            --primary-dark20: color-mix(in srgb, var(--primary) 100%, var(--on-surface) 0%);
            --secondary-light1: color-mix(in srgb, var(--secondary) 5%, var(--surface) 95%);
            --secondary-light2: color-mix(in srgb, var(--secondary) 10%, var(--surface) 90%);
            --secondary-light3: color-mix(in srgb, var(--secondary) 15%, var(--surface) 85%);
            --secondary-light4: color-mix(in srgb, var(--secondary) 20%, var(--surface) 80%);
            --secondary-light5: color-mix(in srgb, var(--secondary) 25%, var(--surface) 75%);
            --secondary-light6: color-mix(in srgb, var(--secondary) 30%, var(--surface) 70%);
            --secondary-light7: color-mix(in srgb, var(--secondary) 35%, var(--surface) 65%);
            --secondary-light8: color-mix(in srgb, var(--secondary) 40%, var(--surface) 60%);
            --secondary-light9: color-mix(in srgb, var(--secondary) 45%, var(--surface) 55%);
            --secondary-light10: color-mix(in srgb, var(--secondary) 50%, var(--surface) 50%);
            --secondary-light11: color-mix(in srgb, var(--secondary) 55%, var(--surface) 45%);
            --secondary-light12: color-mix(in srgb, var(--secondary) 60%, var(--surface) 40%);
            --secondary-light13: color-mix(in srgb, var(--secondary) 65%, var(--surface) 35%);
            --secondary-light14: color-mix(in srgb, var(--secondary) 70%, var(--surface) 30%);
            --secondary-light15: color-mix(in srgb, var(--secondary) 75%, var(--surface) 25%);
            --secondary-light16: color-mix(in srgb, var(--secondary) 80%, var(--surface) 20%);
            --secondary-light17: color-mix(in srgb, var(--secondary) 85%, var(--surface) 15%);
            --secondary-light18: color-mix(in srgb, var(--secondary) 90%, var(--surface) 10%);
            --secondary-light19: color-mix(in srgb, var(--secondary) 95%, var(--surface) 5%);
            --secondary-light20: color-mix(in srgb, var(--secondary) 100%, var(--surface) 0%);
            --secondary-dark1: color-mix(in srgb, var(--secondary) 5%, var(--on-surface) 95%);
            --secondary-dark2: color-mix(in srgb, var(--secondary) 10%, var(--on-surface) 90%);
            --secondary-dark3: color-mix(in srgb, var(--secondary) 15%, var(--on-surface) 85%);
            --secondary-dark4: color-mix(in srgb, var(--secondary) 20%, var(--on-surface) 80%);
            --secondary-dark5: color-mix(in srgb, var(--secondary) 25%, var(--on-surface) 75%);
            --secondary-dark6: color-mix(in srgb, var(--secondary) 30%, var(--on-surface) 70%);
            --secondary-dark7: color-mix(in srgb, var(--secondary) 35%, var(--on-surface) 65%);
            --secondary-dark8: color-mix(in srgb, var(--secondary) 40%, var(--on-surface) 60%);
            --secondary-dark9: color-mix(in srgb, var(--secondary) 45%, var(--on-surface) 55%);
            --secondary-dark10: color-mix(in srgb, var(--secondary) 50%, var(--on-surface) 50%);
            --secondary-dark11: color-mix(in srgb, var(--secondary) 55%, var(--on-surface) 45%);
            --secondary-dark12: color-mix(in srgb, var(--secondary) 60%, var(--on-surface) 40%);
            --secondary-dark13: color-mix(in srgb, var(--secondary) 65%, var(--on-surface) 35%);
            --secondary-dark14: color-mix(in srgb, var(--secondary) 70%, var(--on-surface) 30%);
            --secondary-dark15: color-mix(in srgb, var(--secondary) 75%, var(--on-surface) 25%);
            --secondary-dark16: color-mix(in srgb, var(--secondary) 80%, var(--on-surface) 20%);
            --secondary-dark17: color-mix(in srgb, var(--secondary) 85%, var(--on-surface) 15%);
            --secondary-dark18: color-mix(in srgb, var(--secondary) 90%, var(--on-surface) 10%);
            --secondary-dark19: color-mix(in srgb, var(--secondary) 95%, var(--on-surface) 5%);
            --secondary-dark20: color-mix(in srgb, var(--secondary) 100%, var(--on-surface) 0%);
        }
    </style>
</svelte:head>

{#if children}
    {@render children()}
{/if}