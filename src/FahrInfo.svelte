<script lang="ts">
	import { location } from '@svelte-router/core'
	import {
		infoStore,
		settings,
		sleep,
		uid,
		tourType,
		adminTourType,
		isValidDate
	} from './lib'
	import { getHeaderGet } from './lib/fetchData'
	let { searchDate = $bindable('') } = $props()

	const initHeader = async () => {
		await sleep(200)

		if (!isValidDate(searchDate)) return []

		await sleep(600)
		try {
			const url = `${settings.admin.header.url}?uid=${$uid}&datum=${searchDate}`
			const data = await getHeaderGet(url) // Routentyp, Routenname, Fahrer, Boxen, inuse, RH_ID, Zusatzinfo, History, Kommentar
			return data
		} catch (error) {
			console.log(error)
		}
	}

	let promise = $state(initHeader())
</script>

{#snippet loadingSpinner()}
	<div class="grid h-[400px] place-content-center">
		<div class="sr-only">...loading</div>
		<span class="loading loading-xl loading-spinner text-primary"></span>
	</div>
{/snippet}

<section class="nwp page">
	{@render searchBar()}
	<article>
		{#await promise}
			{@render loadingSpinner()}
		{:then daten}
			<div>
				<div class="list rounded-box bg-base-100 shadow-md">
					<div class="p-4 pb-2 text-sm tracking-wide opacity-60">
						Abfrage {daten.length ? 'Ergebnis' : ''}
					</div>
					{#each daten as item (item.RH_ID)}
						{@render resultRow(item)}
					{:else}
						<div class="list-row">
							<div class="list-col-grow">
								<label for="searchDateEl" class="text-accent"
									>Datum auswählen</label>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/await}
	</article>
</section>

{#snippet resultRow({
	Routentyp,
	Routenname,
	Fahrzeug,
	Fahrer,
	inuse,
	RH_ID,
	Zusatzinfo,
	History,
	Kommentar
})}
	{@const { icon, slug, label } = tourType[Routentyp]}
	<button
		onclick={() => {
			console.log(`Route ${RH_ID} laden`)
			infoStore.set({ Routenname, Zusatzinfo, History, Kommentar })
			location.navigate(`/info/${RH_ID}`)
		}}
		class="list-row cursor-pointer items-center text-left"
		style="--fs: 20px;">
		<div class="list-col-grow">
			<div class="nav">
				{@render iconT(icon)}
				<div class="flex-1">
					<div class="h4 font-bold">{Routenname}</div>
				</div>

				<span
					class="badge badge-md"
					class:badge-primary={label === 'info'}
					class:badge-error={label === 'error'}
					class:badge-warning={label === 'warning'}>{slug}</span>
				<span class="badge {adminTourType[inuse][1]}">
					{adminTourType[inuse][0]}
				</span>
			</div>
			{#if Fahrzeug || Fahrer}
				<div class="stack-list">
					<div>{Fahrzeug}</div>

					<div>{Fahrer}</div>
				</div>
			{/if}
		</div>
	</button>
{/snippet}

{#snippet searchBar()}
	<article>
		<div class="split rounded-box bg-base-100 p-4 shadow-md">
			<div class="flex flex-col gap-1">
				<label>Suche Datum</label>
				<input
					id="searchDateEl"
					type="date"
					bind:value={searchDate}
					onchange={() => {
						if (searchDate) {
							promise = initHeader()
						}
					}}
					class="input" />
			</div>
			<nav class="nav self-end">
				<button
					class:btn-ghost={!searchDate}
					class="btn"
					onclick={() => {
						searchDate = ''
						promise = sleep(100).then(() => [])
					}}>Clear</button>
				<button
					class="btn btn-primary"
					class:btn-soft={!searchDate}
					onclick={() => {
						if (searchDate) {
							promise = initHeader()
						}
					}}>Suche</button>
			</nav>
		</div>
	</article>
{/snippet}
{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
