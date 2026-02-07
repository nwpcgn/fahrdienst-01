<script lang="ts">
	import { uid, rhId, tourId } from './lib/storage'
	import getApiKey from './lib/getApiKey'
	const url4 = 'https://lab-quade.de/fahrdienst_app/tour_header_2.php'
	let { onSuccess } = $props()
	const onSubmit = async () => {
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID: $rhId,
				inuse: 2,
				history: `${datum} ${time}, Tour wieder freigegeben`
			})
		)
		try {
			const response = await fetch(url4, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData.toString()
			})

			const { info, error } = await response.json()
			if (error) {
				alert(JSON.stringify(error))
				throw new Error(error)
			}

			if (info) {
				console.log(info)
				onSuccess()
				return info
			}

			console.log('Kein definierter rückgabewert')
		} catch (f) {
			console.error(f)
			throw new Error(f)
		}
	}
</script>

<nav class="nav">
	{#if $rhId}
		<button
			disabled={$tourId?.length >= 1}
			class="btn btn-error"
			onclick={onSubmit}>Tour Freigeben</button>
	{/if}
</nav>
