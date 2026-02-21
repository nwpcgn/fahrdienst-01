<script lang="ts">
	import { getHeader } from './lib'
	import { rhId, routeStore, fid } from './lib/storage.ts'
	import getApiKey from './lib/getApiKey'
	const tourType = [
		null,
		{
			name: 'Vormittag',
			icon: 'fd-sun',
			slug: 'Früh',
			label: 'info'
		},
		{
			name: 'Nachmittag',
			icon: 'fd-moon',
			slug: 'Spät',
			label: 'error'
		},
		{
			name: 'Sonder',
			icon: 'fd-car',
			slug: 'Sonder',
			label: 'warning'
		}
	]
	const url2 = 'https://lab-quade.de/fahrdienst_app/tour_header.php'
	const init = async () => {
		const { key, datum, time, url } = getApiKey()
		try {
			const data = await getHeader(url)
			if (data) {
				console.log('Header geladen', data.length)
				return data
			}

			//	throw new Error('Fetch Error: No data returned')
		} catch (error) {
			throw new Error(error.message)
		}
	}

	async function sendeDaten(RH_ID: number) {
		const { key, datum, time } = getApiKey()

		// Erstellt einen String im Format: uid=...&datum=...&aktion=...
		const formData = new URLSearchParams()
		formData.append('uid', key)
		formData.append(
			'json_input',
			JSON.stringify({
				RH_ID,
				inuse: 1,
				Fahrer_ID: $fid,
				history: `${datum} ${time}, Tour übernommen`
			})
		)

		try {
			const response = await fetch(url2, {
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
				rhId.set(RH_ID)

				// const uri = `https://lab-quade.de/fahrdienst_app/tour_detail_2.php?uid=${$uid}&tour_id=${$rhId}`
				// promise2 = ladeDetails(uri)
			}

			// console.log('Server sagt:', ergebnis)
		} catch (f) {
			console.error('Fehler:', f)
			throw new Error(f)
		}
	}

	let promise1 = $state(init())

	// let c = { "Routentyp": 1, "Routenname": "AA", "Fahrer": "", "Boxen": 17, "RH_ID": 2828, "Zusatzinfo": "" }
</script>

{#await promise1}
	<p>...loading</p>
{:then value}
	<ul class="list rounded-box bg-base-100 shadow-md">
		<li class="p-4 pb-2 text-sm tracking-wide opacity-60">Routenliste</li>

		{#each value as { Routentyp, Routenname, Fahrer, Boxen, RH_ID, Zusatzinfo }, i (i)}
			{@const { icon, slug, label } = tourType[Routentyp]}

			<li class="list-row items-center" style="--fs: 20px;">
				{@render iconT(icon)}
				<span class="h4 font-bold">{Routenname}</span>

				<span
					class="badge badge-md"
					class:badge-info={label === 'info'}
					class:badge-error={label === 'error'}
					class:badge-warning={label === 'warning'}>{slug}</span>
				<button
					onclick={() => {
						sendeDaten(RH_ID)
						routeStore.set({
							Routentyp,
							Routenname,
							Fahrer,
							Boxen,
							RH_ID,
							Zusatzinfo
						})
						// dialogContent.props = { ...app.activeTour }
						// showModal = true
					}}
					aria-label="Select Route"
					class="btn btn-circle btn-soft">
					{@render iconT('fd-send')}
				</button>
			</li>
		{/each}
	</ul>
{:catch error}
	<h2 class="text-error">Error</h2>
	<h4 class="text-error">{error}</h4>
{/await}

{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
