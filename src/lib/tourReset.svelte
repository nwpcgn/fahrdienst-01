<script lang="ts">
	import { uid, rhId, tourId, fid, settings, fetchHeaderPost } from './'
	import getApiKey from './getApiKey'
	let { onSuccess } = $props()
	const handleTourReset = async () => {
		const { time, datum } = getApiKey()
		const formData = new URLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID: $rhId,
				inuse: 2,
				Fahrer_ID: $fid,
				history: `${datum} ${time}, Tour wieder freigegeben`
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
				console.log('Tour Reset', info)
				onSuccess()
				return info
			}

			if (error) {
				alert(`Tour Reset: ${error}`)
				throw new Error(error)
			}
		} catch (f) {
			console.log('Error: Tour Reset', f)
			console.error(f)
		}
	}
</script>

{#if $rhId}
	<li>
		<a
			href="#/"
			class:pointer-events-none={$tourId?.length >= 1}
			class="split {$tourId?.length >= 1 ? 'opacity-20' : 'text-success'}"
			onclick={(e) => {
				e.preventDefault()
				if ($tourId?.length <= 0) {
					handleTourReset()
				}
			}}>
			<span>Tour Freigeben</span>
			{@render iconT('fd-undo')}
		</a>
	</li>
{/if}

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
