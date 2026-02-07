<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity'
	import DetailItem from './DetailItem.svelte'
	import { getDetail } from './lib'
	import { uid, rhId, tourId, routeLength, routeStore } from './lib/storage.ts'
	import getApiKey from './lib/getApiKey'
	import { sleep } from './lib'
	import { onMount } from 'svelte'
	const url3 = 'https://lab-quade.de/fahrdienst_app/tour_detail_2.php'
	let visited = new SvelteSet<number>()
	const ladeDetails = async (url: string) => {
		// console.log('Lade Details', url)
		try {
			const r = await getDetail(url)
			if (r) {
				routeLength.set(r.length)
				return r
			}

			throw new Error({ error: 'Detail Fetch Error' })
		} catch (error) {
			throw new Error(error)
		}
	}

	const onSubmit = async ({ eins_kuerzel, befunde, material, proben }) => {
		// {eins_kuerzel, befunde, material, proben}
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID: $rhId,
				eins_kuerzel,
				befunde,
				material,
				proben,
				erledigt_um: `${datum} ${time}`
			})
		)
		try {
			const response = await fetch(url3, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString() // Hier wird es zum String
			})

			const { info, error } = await response.json()
			if (error) {
				alert(JSON.stringify(error))
				throw new Error(error)
			}

			if (info) {
				console.log(info)
				return info
			}

			console.log('Kein definierter rückgabewert')

			// console.log('Server sagt:', ergebnis)
		} catch (f) {
			console.error('Fehler:', f)
			throw new Error(f)
		}
	}

	let promise2 = $state(sleep(10))

	onMount(() => {
		if ($rhId) {
			const uri = `https://lab-quade.de/fahrdienst_app/tour_detail_2.php?uid=${$uid}&tour_id=${$rhId}`
			promise2 = ladeDetails(uri)

			if ($tourId) {
				visited = new SvelteSet<number>($tourId)
				// console.log('Visited from tourId:', visited)
			} else {
				// console.log('No tourId, start with empty visited set')
			}
		}
	})
</script>

{#await promise2}
	<p>...loading</p>
{:then value}
	{#if value}
		{#if $routeStore?.Zusatzinfo}
			<div class="mb-4 alert alert-warning shadow-lg">
				{@render iconT('fd-info')}
				<span>{$routeStore?.Zusatzinfo}</span>
			</div>
		{/if}
		<ul class="list bg-base-100 shadow-md">
			{#each value as item, id (id)}
				<DetailItem {...item} {id} {onSubmit} bind:visited></DetailItem>
			{/each}
		</ul>
	{/if}
{:catch error}
	<div><pre>{JSON.stringify(error)}</pre></div>
{/await}
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
