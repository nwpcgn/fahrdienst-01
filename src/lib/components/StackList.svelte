<script lang="ts">
	import { app, tourType } from '../app.svelte.js'
	let { runApp, updateStore } = $props()
</script>

{#if app?.routeList}
	<nav
		class="stack-list w-full gap-0 divide-y divide-base-300 rounded-box border border-base-300">
		{#each app.routeList as { Routentyp, Routenname, Fahrer, Boxen, RH_ID }, i (i)}
			{@const { icon, slug, label } = tourType[Routentyp]}
			<button
				disabled={RH_ID != app.tourId && app.tourId}
				onclick={() => {
					app.setTour({ Routentyp, Routenname, Fahrer, Boxen, RH_ID })
					updateStore()
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
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
