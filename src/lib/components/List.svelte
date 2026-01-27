<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity'
	import type { TourCallBack } from '../types'
	import { apiStore } from '../storage'
	import { app } from '../app.svelte.ts'
	import log from './log/log.svelte.ts'
	import ListItem from './ListItem.svelte'
	import sleep from '../utils/sleep.js'
	let callbackMap = new SvelteMap()
	let listId = $state($apiStore?.step || 1)
</script>

{#if app?.tourList}
	<ul class="list bg-base-100 shadow-sm">
		{#each app.tourList as line, id (id)}
			<ListItem
				{...line}
				{id}
				bind:listId
				onSubmit={async (payload: TourCallBack) => {
					const nextId = app.tourList[id + 1]?.laufende_nummer
					if (!nextId) return
					callbackMap.set(`${nextId}`, payload)
					log.add({ message: 'Callback saved!' })

					await sleep(1000)
					listId = nextId
					apiStore.update((d) => {
						return { ...d, step: listId }
					})
				}}></ListItem>
		{/each}
	</ul>
{/if}
