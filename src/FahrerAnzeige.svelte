<script lang="ts">
	import { location, Router, Route } from '@svelte-router/core'
	import { getSearchGet, getFahrerGet } from './lib/fetchData'
	import {
		alertList,
		Alerts,
		fahrer,
		fid,
		fro,
		IconView,
		nav,
		pageAdapt,
		rhId,
		routeLength,
		routeStore,
		sleep,
		settings,
		Spinner,
		Sprites,
		tourId,
		TourReset,
		uid,
		maxSearchResult
	} from './lib'

	let searchText = $state('')
	let resultCount = $state(0)
	let initSearched = $state(false)

	const init = async () => {
		await sleep(200)

		try {
			const url = `${settings.ANZEIGE_URL}?uid=${$uid}`
			const { data, error } = await getFahrerGet(url)

			if (data) {
				console.log(`Suche wurden geladen: ${data.length} rows`)
				return data
			}

			if (error) {
				console.log('Suche: Nichts gefunden', error)
				return []
			}
		} catch (error) {
			console.log(error)
		}
	}

	let promise = $state(init())

	const searchAdapt = {
		eins_kuezel: 'Kürzel',
		eins_name: 'Name',
		eins_adresse: 'Adresse',
		eins_telefon_lx: 'Rufnummer 1',
		eins_telefon_alternativ: 'Rufnummer 2',
		eins_abwesenheit: 'Urlaub',
		vm_tour_name: 'Name',
		vm_tour_drucken: 'Drucken',
		vm_tour_bedarf: 'Bedarf',
		nm_tour_name: 'Name',
		nm_tour_drucken: 'Drucken',
		nm_tour_bedarf: 'Bedarf',
		so_tour_name: 'Name',
		so_tour_drucken: 'Drucken',
		so_tour_bedarf: 'Bedarf'
	}
</script>

<section class="nwp page">
	<article>
		{#await promise}
			{@render loadingSpinner()}
		{:then daten}
			<div class="list rounded-box bg-base-100 shadow-md">
				{@render listHeader(daten)}

				{#each daten as { Fahrer_Name, Handynummer, Urlaub }, i (i)}
					<div class="list-row">
						<div class="list-col-grow">
							<div class="split">
								<div class="font-semibold">{Fahrer_Name}</div>

								<div>
									{#if Handynummer}
										<a
											href="tel: {Handynummer.replace('0', '+49')}"
											class="text-primary">{Handynummer.replace('0', '+49')}</a>
									{/if}
								</div>
							</div>

							{#if Urlaub}
								<div class="text-sm">Urlaub von: {Urlaub}</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="list-row">
						<div class="list-col-grow">Keine Daten</div>
					</div>
				{/each}
			</div>
		{/await}
	</article>
</section>

{#snippet listHeader(daten)}
	<div class="p-4 pb-2 text-sm tracking-wide opacity-60">Fahrer</div>
{/snippet}

{#snippet loadingSpinner()}
	<div class="grid h-[400px] place-content-center">
		<div class="sr-only">...loading</div>
		<span class="loading loading-xl loading-spinner text-primary"></span>
	</div>
{/snippet}

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
