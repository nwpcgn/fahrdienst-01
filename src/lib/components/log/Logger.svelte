<script lang="ts">
	import Portal from '../util/Portal.svelte'
	import { fade, slide } from 'svelte/transition'
	import { log } from './log.svelte.ts'
	import { onMount } from 'svelte'
	function typewriter(node, { speed = 4 }) {
		const valid =
			node.childNodes.length === 1 &&
			node.childNodes[0].nodeType === Node.TEXT_NODE

		if (!valid) {
			throw new Error(
				`This transition only works on elements with a single text node child`
			)
		}

		const text = node.textContent
		const duration = text.length / (speed * 0.01)

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t)
				node.textContent = text.slice(0, i)
			}
		}
	}
	// let frame: HTMLDivElement | null = $state(null)
	// let fh = $state(0)
	// let fw = $state(0)
	// let fch: number = $state(0)
	// let { label, colorClass = 'bg-base-100 text-base-content' } = $props()
	// const addNote = async () => {
	// 	const obj = getNote()
	// 	console.log(obj)
	// 	log.add(obj)
	// }
	// const clearList = () => {
	// 	log.empty()
	// }

	onMount(() => {
		return () => log.clear()
	})
</script>

<Portal target="#portals">
	{#if log.list.length}
		<div
			class="pointer-events-none absolute inset-x-4 top-4 z-50 flex flex-col items-center gap-2">
			{#each log.list as note (note.id)}
				{@render msgLine(note)}
			{/each}
		</div>
	{/if}
</Portal>

{#snippet msgLine({ id, type, message, dismissible })}
	<section
		transition:slide|global
		role="alert"
		class="log-item"
		class:warning={type === 'warning'}
		class:info={type === 'info'}
		class:error={type === 'error'}
		class:success={type === 'success'}>
		{@render iconT(type === 'error' ? 'fd-error' : 'fd-info')}
		<article>
			<span class="log-text opacity-0">{message}</span>
			<span class="log-text" out:fade={{ duration: 200 }} in:typewriter
				>{message}</span>
		</article>
		{#if dismissible}
			<button
				aria-label="close"
				onclick={() => {
					log.remove(id)
				}}
				class="btn btn-circle btn-sm btn-info">
				{@render iconT('fd-close')}
			</button>
		{/if}
	</section>
{/snippet}
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}

<style>
	.log-item {
		--col: var(--color-info-content);
		--bg: var(--color-info);
		overflow: hidden;
		display: flex;
		align-items: center;
		text-align: left;
		gap: var(--spacing-base);
		padding: vaR(--spacing-sm) var(--spacing-md);
		color: var(--col);
		background-color: var(--bg);
		border-radius: var(--radius-box);
		pointer-events: all;
		article {
			flex: 1;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
			grid-auto-flow: row;
			grid-template-areas: 'log-text';
			grid-area: log-content;
			> * {
				grid-area: log-text;
			}
		}

		.warning {
			--col: var(--color-warning-content);
			--bg: var(--color-warning);
		}
		.error {
			--col: var(--color-error-content);
			--bg: var(--color-error);
		}
		.success {
			--col: var(--color-success-content);
			--bg: var(--color-success);
		}
	}
</style>
