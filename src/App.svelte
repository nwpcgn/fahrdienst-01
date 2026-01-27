<script lang="ts">
	import { app } from './lib/app.svelte.ts'
	import { apiStore } from './lib/storage'
	import { onMount } from 'svelte'
	import { getNote, log } from './lib/components/log/log.svelte.ts'
	import List from './lib/components/List.svelte'
	import Page from './lib/components/Page.svelte'
	import Sprites from './lib/components/Sprites.svelte'
	import StackList from './lib/components/StackList.svelte'
	import Logger from './lib/components/log/Logger.svelte'
	const btnClass =
		'btn btn-soft btn-circle transition-all duration-200 ease transform active:scale-95'

	const views = {
		start: {
			slug: 'start',
			href: '/',
			name: 'Routen',
			icon: 'fd-route',
			component: startTemplate
		},
		tour: {
			slug: 'tour',
			href: '/tour',
			name: 'Tour',
			icon: 'fd-map',
			component: tourTemplate
		},
		info: {
			slug: 'info',
			href: '/info',
			name: 'Info',
			icon: 'fd-info',
			component: infoTemplate
		}
	}
	let viewId = $state('init')
	let vi = $derived(Object.keys(views).indexOf(viewId))
	let view = $derived(views[viewId] || null)
	let timerId: number = $state()
	const next = async () => {
		clear()
		if (vi < Object.keys(views).length - 1) {
			viewId = Object.keys(views)[vi + 1]
		}
	}

	const changeView = (str: string) => {
		if (Object.keys(views).includes(str)) {
			viewId = str
		}
	}

	const addNote = async () => {
		const obj = getNote()
		console.log(obj)
		log.add(obj)
	}

	const clear = () => {
		if (timerId) clearTimeout(timerId)
	}

	onMount(() => {
		if (app.apiKey !== $apiStore.key) {
			console.log('NewDay', app.apiKey)
			const key = app.apiKey
			const datum = app.apiDatum
			apiStore.set({
				key,
				datum,
				step: 1
			})
			app.init()
		}

		timerId = setTimeout(next, 3333)

		return () => clear()
	})
</script>

<div class="sticky top-0 z-20 bg-base-100 shadow-sm">
	<nav class="content is-flat navbar">
		<div class="nav flex-1">
			{#if app.activeTour}
				{@render iconT('fd-car')}<span class="text-xl font-bold"
					>{$apiStore?.tour.Routenname}</span>
				{@render iconT('fd-box')}<span class="text-xl font-bold"
					>{$apiStore?.tour.Boxen}</span>
			{:else}
				<button class="btn btn-ghost" onclick={addNote}>{view?.name}</button>
			{/if}
		</div>
		<div class="flex gap-1">
			{#each Object.values(views) as { name, icon, slug }, i (i)}
				<button
					onclick={() => {
						viewId = slug
					}}
					class={btnClass}
					class:btn-info={viewId === slug}
					aria-label={name}>
					{@render iconT(icon)}
				</button>
			{/each}
		</div>
	</nav>
</div>
<div class="layout">
	<div class="main">
		{@render view?.component?.({ ...view })}
		{#if !view}
			{@render spinnerT()}
		{/if}
	</div>
	<div class="aside">
		<Logger></Logger>
	</div>
</div>
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}

{#snippet spinnerT()}
	<div class="page nwp center bg-neutral text-neutral-content">
		<button class="button" onclick={next}> <div class="loader"></div></button>
	</div>
{/snippet}
{#snippet startTemplate({ name, icon })}
	<Page center>
		<header class="nav mb-8" style="--fs: 32px;">
			{@render iconT(icon)}
			<h1>{name}</h1>
		</header>
		<StackList {next}></StackList>
	</Page>
{/snippet}
{#snippet tourTemplate()}
	<Page>
		<List></List>
	</Page>
{/snippet}
{#snippet infoTemplate({ name, icon })}
	<Page>
		<List></List>
	</Page>
{/snippet}
<div id="portals"></div>
<Sprites />
