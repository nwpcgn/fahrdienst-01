<script lang="ts">
	import DetailItem from './DetailItem.svelte'
	import { getDetail } from './lib'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import getApiKey from './lib/getApiKey'
	import { sleep } from './lib'
	const url3 = 'https://lab-quade.de/fahrdienst_app/tour_detail_2.php'

	const ladeDetails = async (url: string) => {
		console.log('Lade Details', url)
		try {
			const r = await getDetail(url)
			if (r) return r

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

	$effect(() => {
		if ($rhId) {
			const uri = `https://lab-quade.de/fahrdienst_app/tour_detail_2.php?uid=${$uid}&tour_id=${$rhId}`
			promise2 = ladeDetails(uri)
		}
	})
</script>

{#await promise2}
	<p>...loading</p>
{:then value}
	{#if value}
		<!-- <div><pre>{JSON.stringify(value)}</pre></div> -->
		<ul class="list rounded-box bg-base-100 shadow-md">
			{#each value as item, id (id)}
				<DetailItem {...item} {id} {onSubmit}></DetailItem>
			{/each}
		</ul>
	{/if}
{:catch error}
	<div><pre>{JSON.stringify(error)}</pre></div>
{/await}
