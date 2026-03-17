<script lang="ts">
	import { location, Router, Route } from '@svelte-router/core'
	import { getSearchGet } from './lib/fetchData'
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

	const initSearch = async () => {
		await sleep(200)
		initSearched = true
		resultCount = 0
		if (!searchText) return []

		await sleep(600)
		try {
			const url = `${settings.SEARCH_URL}?uid=${$uid}&suche=${searchText}`
			const { data, error } = await getSearchGet(url)

			if (data) {
				console.log(`Suche wurden geladen: ${data.length} rows`)
				resultCount = data?.length

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
	const init = async () => {
		await sleep(200)
		return []
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

{#snippet resultRow({
	eins_kuezel,
	eins_name,
	eins_adresse,
	eins_telefon_lx,
	eins_telefon_alternativ,
	eins_abwesenheit,
	vm_tour_name,
	vm_tour_drucken,
	vm_tour_bedarf,
	nm_tour_name,
	nm_tour_drucken,
	nm_tour_bedarf,
	so_tour_name,
	so_tour_drucken,
	so_tour_bedarf
})}
	<div class="list-row bg-base-300">
		<div class="w-32">{searchAdapt['eins_kuezel']}</div>
		<div>{eins_kuezel}</div>
	</div>
	<div class="list-row">
		<div class="w-32">{searchAdapt['eins_name']}</div>
		<div>{@html eins_name.replaceAll('\n', '<br>')}</div>
	</div>
	<div class="list-row">
		<div class="w-32">{searchAdapt['eins_adresse']}</div>
		<a
			class="text-primary"
			href="https://maps.google.de/?daddr={eins_adresse}&saddr=My+Location"
			target="_blank"
			rel="noreferrer">{@html eins_adresse.replaceAll('\n', '<br>')}</a>
	</div>
	<div class="list-row">
		<div class="w-32">{searchAdapt['eins_telefon_lx']}</div>
		<div>
			{#if eins_telefon_lx}
				<a
					href="tel: {eins_telefon_lx.replace('0', '+49')}"
					target="_blank"
					rel="noreferrer"
					class="text-primary">
					{eins_telefon_lx}
				</a>
			{/if}
		</div>
	</div>
	<div class="list-row">
		<div class="w-32">{searchAdapt['eins_telefon_alternativ']}</div>
		<div>
			{#if eins_telefon_alternativ}
				<a
					href="tel: {eins_telefon_alternativ.replace('0', '+49')}"
					target="_blank"
					rel="noreferrer"
					class="text-primary">
					{eins_telefon_alternativ}
				</a>
			{/if}
		</div>
	</div>
	<div class="list-row">
		<div class="w-32">{searchAdapt['eins_abwesenheit']}</div>
		<div>{eins_abwesenheit}</div>
	</div>
	<details class="collapse bg-base-200">
		<summary class="collapse-title font-semibold">Tourinfos</summary>
		<div class="collapse-content bg-base-100">
			<table class="table">
				<thead>
					<tr>
						<th>Art</th>
						<th>Name</th>
						<th>Bedarf</th>
						<th>Drucken</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Vormittag</th>
						<td>{vm_tour_name}</td>
						<td>{vm_tour_bedarf === 'B' ? 'J' : ''}</td>
						<td>{vm_tour_drucken}</td>
					</tr>
					<tr>
						<th>Nachmittag</th>
						<td>{nm_tour_name}</td>
						<td>{nm_tour_bedarf === 'B' ? 'J' : ''}</td>
						<td>{nm_tour_drucken}</td>
					</tr>
					<tr>
						<th>Sonder</th>
						<td>{so_tour_name}</td>
						<td>{so_tour_bedarf === 'B' ? 'J' : ''}</td>
						<td>{so_tour_drucken}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</details>
{/snippet}

<section class="nwp page">
	{@render searchBar()}
	<article>
		{#await promise}
			{@render loadingSpinner()}
		{:then daten}
			<div class="list rounded-box bg-base-100 shadow-md">
				{@render listHeader(daten)}

				{#if resultCount > $maxSearchResult}
					<div class="list-row">
						<div class="list-col-grow">
							<div class="font-bold">Zu viele Ergebnisse</div>
							<div>Bitte mehr Suchtext eingeben</div>
						</div>
					</div>
				{:else}
					{#each daten as item, i (i)}
						{@render resultRow(item)}
						{#if i < daten.length - 1}
							<hr class="my-4 border-t-6 text-primary" />
						{/if}
					{:else}
						<div class="list-row">
							<div class="list-col-grow">
								<label for="searchTextEl"
									>{!initSearched
										? 'Suchbegriff eingeben'
										: 'Keine Einträge'}</label>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/await}
	</article>
</section>

{#snippet listHeader(daten)}
	<div class="p-4 pb-2 text-sm tracking-wide opacity-60">
		Abfrage (max: {$maxSearchResult}) {daten.length ? 'Ergebnis' : ''}
	</div>
{/snippet}

{#snippet searchBar()}
	<article>
		<div class="split rounded-box bg-base-100 p-4 shadow-md">
			<div>
				<label class="flex flex-col">
					<input
						onblur={() => {
							if (searchText) {
								promise = initSearch(searchText)
							}
						}}
						id="searchTextEl"
						bind:value={searchText}
						type="search"
						class="input"
						placeholder="Suche" />
					<div
						class="split px-2 py-1"
						class:text-error={searchText.length < settings.SEARCH_MIN}>
						<span class="text-xs font-light"
							>{searchText?.length < settings.SEARCH_MIN
								? `min. ${settings.SEARCH_MIN} Zeichen eingeben`
								: `Nach '${searchText}' suchen`}</span>
						<span class="opacity-0">1</span>
					</div>
				</label>

				<!--  -->
			</div>
			<nav class="nav self-end">
				<button
					class:btn-ghost={!searchText}
					class="btn"
					onclick={() => {
						searchText = ''

						promise = sleep(100).then(() => [])
					}}>Clear</button>
				<button
					class="btn btn-primary"
					class:btn-soft={!searchText}
					onclick={() => {
						if (searchText?.length > 3) {
							promise = initSearch()
						}
					}}>Suche</button>
			</nav>
		</div>
	</article>
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
