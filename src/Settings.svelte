<script lang="ts">
	import { location, Router, Route } from '@svelte-router/core'
	import {
		maxSearchResult,
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
		Spinner,
		Sprites,
		tourId,
		TourReset,
		uid
	} from './lib'
</script>

<section class="nwp page">
	<article>
		<div class="split rounded-box bg-base-100 p-4 shadow-md">
			<h4>Settings</h4>
			<span></span>
		</div>
		<div class="list rounded-box bg-base-100 shadow-md">
			<div class="p-4 pb-2 text-sm tracking-wide opacity-60">Einstellungen</div>
			{#if $fro != 1}
				<div class="list-row items-center">
					<div class="list-col-grow">Max. Suchergebnisse</div>
					<label>
						<input type="number" bind:value={$maxSearchResult} class="input" />
					</label>
				</div>
			{/if}
		</div>
	</article>
</section>
