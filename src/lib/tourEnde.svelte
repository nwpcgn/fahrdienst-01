<script lang="ts">
	import {
		uid,
		rhId,
		tourId,
		alertList,
		fid,
		settings,
		fetchHeaderPost
	} from '.'
	import getApiKey from './getApiKey'
	// import type { Snippet } from 'svelte'

	// let { children }: { children: Snippet } = $props()
	let { isOpen = $bindable(false) } = $props()
	let kommentar = $state('')

	const handleSubmit = async () => {
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID: $rhId,
				inuse: 3,
				Fahrer_ID: $fid,
				history: `${datum} ${time}, Tour beendet`,
				Kommentar: kommentar
			})
		)
		try {
			const response = await fetch(settings.fahrer.header.url, {
				method: 'POST',
				headers: fetchHeaderPost,
				body: formData.toString()
			})

			const { info, error } = await response.json()

			if (info) {
				console.log('Tour Beenden', info)
				alertList.set([])
				rhId.set(0)
				tourId.set([])
				return info
			}

			if (error) {
				alert(`Tour Beenden error: ${error}`)
				rhId.set(0)
				alertList.set([])
				tourId.set([])
				throw new Error(error)
			}
		} catch (f) {
			console.error(f)
		}
	}
</script>

<div class="mt-4">
	<div class="collapse bg-base-100 shadow-md shadow-base-300">
		<input bind:checked={isOpen} type="checkbox" />
		<div class="collapse-title font-semibold text-accent">Beenden ?</div>
		<div class="collapse-content">
			<div class="flex w-full flex-col gap-2 py-4">
				<!-- 	<label class="label">Beenden</label> -->
				<textarea
					bind:value={kommentar}
					class="textarea w-full"
					rows="4"
					placeholder="Kommentar"></textarea>
				<button onclick={handleSubmit} class="btn btn-accent"
					>Tour beenden</button>
			</div>
		</div>
	</div>
</div>
