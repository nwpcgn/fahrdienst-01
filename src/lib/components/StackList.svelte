<script lang="ts">
	import { apiStore } from './../storage.ts'
	import { app, tourType } from '../app.svelte.js'
	// import Dialog from './Dialog.svelte'
	// let { changeView } = $props()
	// let dialogContent = $state({
	// 	snippet: routeSelect,
	// 	props: {
	// 		slug: 'map',
	// 		name: 'Map',
	// 		icon: 'fd-map'
	// 	}
	// })
	let { runApp } = $props()
	// let showModal = $state(false)

	let current = $derived($apiStore?.tour?.RH_ID || 0)
</script>

{#if app?.routeList}
	<nav
		class="stack-list w-full gap-0 divide-y divide-base-300 rounded-box border border-base-300">
		{#each app.routeList as { Routentyp, Routenname, Fahrer, Boxen, RH_ID }, i (i)}
			{@const { name, icon, slug, label } = tourType[Routentyp]}
			<button disabled={$apiStore.tour?.RH_ID && app.tourId != RH_ID}
				onclick={() => {
					app.setTour({ Routentyp, Routenname, Fahrer, Boxen, RH_ID })
					apiStore.update((d) => {
						return { ...d, tourId: RH_ID, tour: app.activeTour }
					})
					runApp()
					// dialogContent.props = { ...app.activeTour }
					// showModal = true
				}}
				class="button"
				class:active={RH_ID === app.tourId}>
				<div class="stack-item" style="--fs: 20px;">
					{@render iconT(icon)}
					<span class="h4 font-bold">{Routenname}</span>
					<span class="flex-1"></span>
					<span
						class="badge badge-sm"
						class:badge-info={label === 'info'}
						class:badge-error={label === 'error'}
						class:badge-warning={label === 'warning'}>{slug}</span>
				</div>
			</button>
		{/each}
	</nav>
{/if}
<!-- <Dialog bind:showModal>
	{@render dialogContent.snippet?.(dialogContent.props)}
	{#snippet footer()}
		<form method="dialog" class="modal-action">
			<button
				onclick={async () => {
					changeView('tour')
				}}
				class="btn btn-neutral">Starten</button>
			<button class="btn btn-error">Cancel</button>
		</form>
	{/snippet}
</Dialog> -->
{#snippet routeSelect({ Routenname, Fahrer, Boxen, RH_ID })}
	<h2 class="mb-4">Selected Tour</h2>
	<div class="stack-list">
		<div class="nav">
			{@render iconT('fd-car')}
			<span class="text-2xl font-bold"> {RH_ID}</span>
		</div>
		<div>
			{@render iconT('fd-route')}
			<span class="text-2xl font-bold">{Routenname}</span>
		</div>
		<div>
			{@render iconT('fd-box')}
			<span class="text-xl font-medium">{Boxen}</span>
		</div>
	</div>
{/snippet}
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
