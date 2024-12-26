<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    interface IconProps extends HTMLAttributes<HTMLSpanElement> {
        icon?: string;
        color?: string;
        outlined?: boolean;
        size?: number;
        style?: string;
        weight?: number;
    }

    let {
        icon: _icon,
        color,
        outlined,
        size,
        style: _style = '',
        weight,
        ...rest
    }: IconProps = $props();

    let _weight = $derived(weight ? `--weight:${weight};` : '');
    let _fill = $derived(outlined ? '--fill:0;' : ``);
    let _color = $derived(color ? `color:${color};` : '');
    let _size = $derived(size ? `font-size:${size}px;` : '');

    let style = $derived(`${_fill}${_weight}${_color}${_size}${_style}`);
    let icon = $derived(_icon || Object.keys(rest)[0]);
</script>

<span class="notranslate" {style} aria-hidden="true" data-nosnippet {...rest}>{icon}</span>

<style lang="scss">
  @font-face {
    font-family: 'Material Symbols Rounded';
    font-style: normal;
    font-weight: 100 700;
    src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v200/kJEhBvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oFsLjBuVY.woff2) format('woff2');
  }

  span {
    font-family: 'Material Symbols Rounded';
    font-display: block;
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    user-select: none;
    transition: all 0.2s;
    vertical-align: bottom;

    font-variation-settings: 'FILL' var(--fill, 1),
    'wght' var(--weight, 500),
    'GRAD' 0
  }
</style>
