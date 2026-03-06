<script lang="ts">
	import { location } from '@svelte-router/core'
	import { fro, sleep } from './lib'
	const init = async () => {
		await sleep(100)
		if ($fro == 1) {
			location.navigate('/dienst')
			return 'not-allowed'
		}

		return 'ready'
	}
	let promise = $state(init())
</script>

{#await promise then value}
	<section class="nwp page center" data-status={value}>
		<div class="w-68 p-4 text-center">
			<div class="grid gap-1">
				<h2>Lobby</h2>
				{#if $fro == 1}
					<a class="btn join-item" href="#/dienst">Fahrdienst</a>
				{:else if $fro == 3}
					<a class="btn join-item" href="#/info">Fahrinfo</a>
					<a class="btn join-item" href="#/settings">Suche</a>
				{:else}
					<a class="btn join-item" href="#/dienst">Fahrdienst</a>
					<a class="btn join-item" href="#/info">Fahrinfo</a>
					<a class="btn join-item" href="#/suche">Suche</a>
				{/if}
			</div>
		</div>
	</section>
{/await}
