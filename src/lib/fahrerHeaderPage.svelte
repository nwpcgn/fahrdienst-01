<script lang="ts">
	import getApiKey from './getApiKey'
	import { settings, tourType, adminTourType, routeStore } from '.'
	import { getHeaderGet, selectRoute } from './fetchData'
	// import type { Snippet } from 'svelte'

	// let { children }: { children: Snippet } = $props()
	const initHeader = async () => {
		try {
			const { key, datum } = getApiKey()
			const url = `${settings.fahrer.header.url}?uid=${key}&datum=${datum}`
			const data = await getHeaderGet(url)
			// Routentyp,Routenname,Fahrer,Fahrzeug,Boxen,RH_ID,Zusatzinfo
			// Routentyp, Routenname, Fahrer, Boxen, inuse, RH_ID, Zusatzinfo, History, Kommentar
			return data
		} catch (error) {
			console.log(error)
		}
	}

	let promise = $state(initHeader())
</script>

<section class="nwp page">
	<article>
		{#await promise then daten}
			<div>
				<div class="list rounded-box bg-base-100 shadow-md">
					<div class="p-4 pb-2 text-sm tracking-wide opacity-60">
						Routenliste
					</div>
					{#each daten as { Routentyp, Routenname, Fahrzeug, inuse, RH_ID, Zusatzinfo, Boxen }, id (id)}
						{@const { icon, slug, label } = tourType[Routentyp]}
						<button
							onclick={() => {
								console.log('Route laden')
								selectRoute(RH_ID)
								routeStore.set({
									Routenname,
									Boxen,
									Zusatzinfo
								})
								// location.navigate(`/dienst/${RH_ID}`)
							}}
							class="list-row cursor-pointer items-center text-left"
							style="--fs: 20px;">
							{@render iconT(icon)}
							<div>
								<div class="h4 font-bold">{Routenname}</div>
								{#if Fahrzeug}
									<div>{Fahrzeug}</div>
								{/if}
								<!-- <div>{Fahrer}</div> -->
							</div>
							{#if inuse}
								<span class="badge {adminTourType[inuse][1]}">
									{adminTourType[inuse][0]}
								</span>
							{/if}

							<span
								class="badge badge-md"
								class:badge-primary={label === 'info'}
								class:badge-error={label === 'error'}
								class:badge-warning={label === 'warning'}>{slug}</span>
						</button>
					{:else}
						<div class="list-row">
							<div class="list-col-grow">
								<div>Nichts gefunden</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/await}
	</article>
</section>

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
