<script lang="ts">
	import { onMount } from 'svelte'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import getApiKey from './lib/getApiKey'
	import Dialog from './lib/components/Dialog.svelte'
	let intId: number | null = $state(null)

	const fetchAlerts = async () => {
		console.log('Fetch Alerts')

		const url = `https://lab-quade.de/fahrdienst_app/tour_nachricht_2.php?uid=${$uid}&rh_id=${$rhId}`
		try {
			// console.log(url) // 'https://lab-quade.de/fahrdienst_app/tour_header_2.php?uid=e511dc6d6f5009dca62724a45f8e17c1&datum=2026-02-02'
			const response = await fetch(url, {
				method: 'GET',
				mode: 'cors'
			})

			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`)
			}

			const { data, error } = await response.json()

			if (error) {
				console.log('Error', error)
				throw new Error(error)
			}

			if (data) {
				console.log('Nachrichten', data)
				return data
			}

			// const contentType = response.headers.get('content-type')

			// if (contentType && contentType.includes('application/json')) {
			// 	// const data = await response.json()
			// 	// const tourenData = data.routen_kopf_daten ?? data
			// 	return response.json()
			// } else {
			// 	return response.text()
			// }
		} catch (error) {
			console.error('Fehler beim Abrufen der Daten:', error)
			throw new Error(error)
		}
	}

	const onSubmit = async (rnid: number) => {
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RN_ID: rnid,
				gelesen_um: `${datum} ${time}`
			})
		)
		try {
			const response = await fetch(
				'https://lab-quade.de/fahrdienst_app/tour_nachricht_2.php',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: formData.toString()
				}
			)

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
		} catch (f) {
			console.error(f)
			throw new Error(f)
		}
	}

	let promise = $state(fetchAlerts())

	onMount(() => {
		intId = setInterval(
			() => {
				promise = fetchAlerts()
			},
			1000 * 60 * 2
		)
		return () => {
			if (intId) clearInterval(intId)
		}
	})
</script>

{#await promise then value}
	{#if value.length > 0}
		{#each value as item, i (i)}
			<Dialog showModal={true}>
				<div>{@html item?.Nachricht?.replaceAll('\n', '<br>')}</div>
				<div class="modal-action">
					<form method="dialog">
						<!-- if there is a button in form, it will close the modal -->
						<button
							class="btn"
							onclick={() => {
								onSubmit(item?.rn_id)
							}}>OK</button>
					</form>
				</div>
			</Dialog>
		{/each}
	{/if}
{/await}
