<script lang="ts">
	import { Render } from '$lib/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Renderable } from '$lib/util.svelte.js';

	interface TableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
		style?: string;
		children?: Renderable;
		header?: Renderable;
		stickyTop?: boolean | number | string | null;
		stickyLeft?: boolean | number | string | null;
	}

	let {
		style = '',
		children,
		header,
		stickyTop: _st = false,
		stickyLeft: _sl = false,
		...rest
	}: TableProps = $props();

	function parseSticky(v: boolean | number | string | undefined | null) {
		if (v === true) return '0px';
		else if (v === false || v === undefined || v === null) return '';
		else if (!isNaN(+v)) return v + 'px';
		else return (v || '').toString();
	}

	let st = $derived(parseSticky(_st));
	let sl = $derived(parseSticky(_sl));
</script>

<main {style} class:st class:sl style:--stv={st} style:--slv={sl}>
	<table {...rest}>
		<thead>
			<Render it={header} />
		</thead>
		<Render {children} />
	</table>
</main>

<style>
	main {
		width: 100%;
		position: relative;

		&.st thead :global(th) {
			position: sticky;
			top: var(--stv);
		}

		&.sl {
			& :global(tbody tr:nth-child(even) > *:first-child) {
				background: var(--primary-light1);
			}

			& :global(tr:nth-child(odd) > *:first-child) {
				background: var(--surface);
			}

			& :global(tbody tr:hover > *:first-child) {
				background: var(--primary-light3);
			}

			& :global(tr > *:first-child) {
				position: sticky;
				left: var(--slv);
				z-index: 1;
				border-right: 1px solid var(--primary-light2);
			}
		}
	}

	.st {
		& :global(thead th) {
			z-index: 1;
			background: var(--surface);
		}
	}

	.sl.st :global(thead th:first-child) {
		z-index: 2;
	}

	table {
		border-spacing: 0;
		margin-bottom: 20px;
		max-width: 100vw;
		--r: 12px;

		& :global(th) {
			padding: 12px;
			font-weight: 600;
			text-align: left;
			position: relative;

			&:first-child {
				border-top-left-radius: var(--r);
				border-bottom-left-radius: var(--r);
			}

			&:last-child {
				border-top-right-radius: var(--r);
				border-bottom-right-radius: var(--r);
			}

			&:after {
				position: absolute;
				content: '';
				bottom: 0;
				left: 0;
				right: 0;
				height: 1px;
				border-bottom: 1px solid var(--primary-light3);
			}

			&:first-child:after {
				left: 12px;
			}

			&:last-child:after {
				right: 12px;
			}
		}

		& :global(tbody tr:hover) {
			background-color: var(--primary-light3);
			--r: 18px;
		}

		& :global(tr) {
			transition: background 0.2s ease-in-out;

			&:nth-child(even) {
				background-color: var(--primary-light1);
			}

			&:active {
				--r: 24px;
			}
		}

		& :global(td) {
			padding: 10px;
			transition: all 0.2s ease-in-out;

			&:first-child {
				border-top-left-radius: var(--r);
				border-bottom-left-radius: var(--r);
			}

			&:last-child {
				border-top-right-radius: var(--r);
				border-bottom-right-radius: var(--r);
			}
		}
	}
</style>
