<script lang="ts">
	import { onMount } from 'svelte'
	import {
		uid,
		rhId,
		alertList,
		settings,
		Dialog,
		fetchHeaderGet,
		fetchHeaderPost
	} from './'
	import getApiKey from './getApiKey'
	let intId: number | null = $state(null)
	let sound: HTMLAudioElement = $state(null)
	let isReload = $state(false)
	const fetchAlerts = async () => {
		const url = `${settings.ALERT_URL}?uid=${$uid}&rh_id=${$rhId}`
		try {
			const response = await fetch(url, fetchHeaderGet)
			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`)
			}
			const { data } = await response.json()

			if (data) {
				console.log('Nachrichten eingegangen', data)
				if (data[0]?.Nachricht.includes('Achtung Tourdaten')) {
					isReload = true
				}
				sound.play()
				return data
			}

			return []
		} catch (error) {
			console.error('Fehler beim Abrufen der Daten:', error)
		}
	}

	const handleAlertResponse = async (rnid: number) => {
		const { time, datum } = getApiKey()
		const url = settings.ALERT_URL
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RN_ID: rnid,
				gelesen_um: `${datum} ${time}`
			})
		)
		const header = {
			method: 'POST',
			headers: fetchHeaderPost,
			body: formData.toString()
		}
		try {
			const response = await fetch(url, header)
			const { info, error } = await response.json()
			if (info) {
				console.log('Nachrichten Eingang bestätigt', info)
				return info
			}
			if (error) {
				alert(JSON.stringify(error))
				throw new Error(error)
			}
		} catch (error) {
			console.error(error)
		} finally {
			if (isReload) {
				location.reload()
			}
			isReload = false
		}
	}

	let promise = $state(fetchAlerts())

	onMount(() => {
		intId = setInterval(() => {
			promise = fetchAlerts()
		}, 1000 * settings.ALERT_INTERVAL)
		return () => {
			if (intId) clearInterval(intId)
		}
	})
</script>

<audio bind:this={sound} src="./beep.mp3"></audio>

{#await promise then value}
	{#if value.length > 0}
		{#each value as item, i (i)}
			<Dialog showModal={true}>
				<div>{@html item?.Nachricht?.replaceAll('\n', '<br>')}</div>
				<div class="modal-action">
					<form method="dialog">
						<button
							class="btn"
							onclick={() => {
								handleAlertResponse(item?.rn_id)
								const { time } = getApiKey()
								alertList.update((d) => {
									return [...d, `${time} ${item?.Nachricht}`]
								})
							}}>OK</button>
					</form>
				</div>
			</Dialog>
		{/each}
	{/if}
{/await}
