<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity'
	import DetailItem from './DetailItem.svelte'
	import { getDetail } from './lib'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import getApiKey from './lib/getApiKey'
	import { sleep } from './lib'
	import { onMount } from 'svelte'
	const url4 = 'https://lab-quade.de/fahrdienst_app/tour_header_2.php'

	/* 	const ladeDetails = async (url: string) => {
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
	} */

	const onSubmit = async () => {
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID: $rhId,
				inuse: 3,
				history: `${datum} ${time}, Tour beendet`
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
				rhId.set(0)
				tourId.set([])

				return info
			}

			console.log('Kein definierter rückgabewert')
		} catch (f) {
			console.error(f)
			throw new Error(f)
		}
	}

	// let promise2 = $state(sleep(10))
</script>

<footer class="p-4 text-center">
	<button onclick={onSubmit} class="btn btn-error">Tour beenden</button>
</footer>
