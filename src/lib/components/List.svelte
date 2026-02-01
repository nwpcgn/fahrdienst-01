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
					/* ----------------------------- Übernahme Tour ----------------------------- */
					// {eins_kuerzel:eins_kuerzel,befunde:befunde,material:material,proben:proben}
					const o = `uid=${app.key}&json_input=`
					// RH_ID:"", inuse: 0, history: timestamp, 1 tour übernommen 0 tour freigegeben
					const jetzt = new Date()
					const now = jetzt.toLocaleTimeString('de-DE', {
						hour: '2-digit',
						minute: '2-digit'
					})
					console.log(`${app.datum} ${now}`)
					const b = { RH_ID: app.tourId, history: '' }
					const j = `RH_ID: `

					/* --------------------------- Übernahme tour ende -------------------------- */
					// Falsche UID
					// Keine Daten
					// Zu wenig Daten
					 // Tour Besetzt



					 
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
