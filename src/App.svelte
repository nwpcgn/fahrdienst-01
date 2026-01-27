<script lang="ts">
	import { apiStore } from './lib/storage'
	import { app } from './lib/app.svelte.ts'
	import { onMount } from 'svelte'
	import List from './lib/components/List.svelte'
	import log from './lib/components/log/log.svelte.ts'
	import Logger from './lib/components/log/Logger.svelte'
	import Page from './lib/components/Page.svelte'
	import Spinner from './lib/components/Spinner.svelte'
	import Sprites from './lib/components/Sprites.svelte'
	import StackList from './lib/components/StackList.svelte'
	import sleep from './lib/utils/sleep'
	const btnClass =
		'btn btn-soft btn-circle transition-all duration-200 ease transform active:scale-95'
	const STAT = Object.freeze({
		init: 'INIT',
		ready: 'READY',
		run: 'RUN'
	})
	let stat = $state(STAT.init)
	let showSb = $state(false)
	let timerId: number = $state()
	const logText = (
		message: string,
		type: string = 'info',
		timeout: number = 5000
	) => {
		log.add({ message, type, timeout })
	}
	const isReady = async () => {
		logText('App Init Ready', 'success', 2000)
		clear()
		stat = STAT.ready
		if (app.activeTour) {
			await sleep(100)
			stat = STAT.run
		}
	}
	const runApp = async () => {
		console.log('Run')
		clear()
		stat = STAT.run
	}
	const clear = () => {
		if (timerId) clearTimeout(timerId)
	}

	const updateStore = () => {
		const info = app.info()
		apiStore.update((d) => {
			return {
				...d,
				key: info.key,
				datum: info.datum,
				url1: info.url1,
				name: info.name,
				fahrer: info.fahrer,
				boxen: info.boxen,
				tourId: info.tourId
			}
		})
	}
	const initApp = async () => {
		if ($apiStore?.key && app?.key) {
			if ($apiStore.key !== app.key) {
				app.reset()
				updateStore()
			} else {
				app.restore({ ...$apiStore })
				app.init()
			}
		} else {
			app.init()
			updateStore()
		}
	}

	onMount(() => {
		initApp()

		timerId = setTimeout(isReady, 3333)

		return () => clear()
	})
	// $inspect('State', stat)
	// $inspect('Store', $apiStore)
</script>

<div class="sticky top-0 z-20 bg-base-100 shadow-sm">
	<nav class="content is-flat navbar">
		<div class="nav flex-1 text-xl font-bold">
			{#if app.tourId}
				{@render iconT('fd-car')}<span>{$apiStore?.name}</span>
				{@render iconT('fd-box')}<span>{$apiStore?.boxen}</span>
				{@render iconT('fd-map')}<span
					><span class="text-info">{$apiStore?.step}</span>/{app.tourList
						?.length}</span>
			{:else}
				<span class="">Fahrdienst</span>
			{/if}
		</div>
		<div class="flex gap-1">
			<button
				onclick={() => {
					showSb = !showSb
				}}
				class={btnClass}
				aria-label="Info">
				{@render iconT('fd-burger')}
			</button>
		</div>
	</nav>
</div>

<div class="layout">
	<div class="main">
		{#if stat === 'READY'}
			<Page center>
				<header class="nav mb-8" style="--fs: 32px;">
					{@render iconT('fd-route')}
					<h1>Routen</h1>
				</header>
				<StackList {updateStore} {runApp}></StackList>
			</Page>
		{/if}
		{#if stat === 'RUN'}
			<Page>
				<List {updateStore}></List>
			</Page>
		{/if}
		{#if stat === 'INIT'}
			<Spinner onClick={isReady} />
		{/if}
	</div>
	{@render sideBar()}
	<div class="aside">
		<Logger></Logger>
	</div>
</div>

{#snippet sideBar()}
	<aside
		class="absolute inset-0 z-40 transform border bg-base-200 transition-all duration-400 ease-in"
		class:opacity-50={!showSb}
		class:translate-x-full={!showSb}>
		<div class="content">
			<h1 class="mb-4">Info</h1>
			<details
				class="collapse border border-base-300 bg-base-100"
				name="my-accordion-det-1"
				open>
				<summary class="collapse-title font-semibold">App Data</summary>
				<div class="collapse-content text-sm">
					<div class="overflow-hidden">
						<pre
							class="overflow-auto bg-neutral p-2 text-success">{JSON.stringify(
								app.info(),
								null,
								2
							)}</pre>
					</div>
				</div>
			</details>
			<details
				class="collapse border border-base-300 bg-base-100"
				name="my-accordion-det-1">
				<summary class="collapse-title font-semibold">Store</summary>
				<div class="collapse-content text-sm">
					<div class="overflow-hidden">
						<pre
							class="overflow-auto bg-neutral p-2 text-success">{JSON.stringify(
								$apiStore,
								null,
								2
							)}</pre>
					</div>
				</div>
			</details>
			<details
				class="collapse border border-base-300 bg-base-100"
				name="my-accordion-det-1">
				<summary class="collapse-title font-semibold">Reset</summary>
				<div class="collapse-content">
					<nav>
						<button
							class="btn btn-soft btn-xl btn-error"
							onclick={() => {
								apiStore.set({
									key: null,
									datum: null,
									step: 1
								})
								app.reset()
								stat = STAT.init
								showSb = false
								clear()
								timerId = setTimeout(isReady, 3333)
							}}>Reset App</button>
					</nav>
				</div>
			</details>
		</div>
	</aside>
{/snippet}

{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}

<div id="portals"></div>
<Sprites />
