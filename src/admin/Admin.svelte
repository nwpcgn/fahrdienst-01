<script lang="ts">
	const getHeader = {
		method: 'GET',
		mode: 'cors'
	}
	const settings = {
		header: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_header_admin.php',
			template: 'headerListA',
			getKeys: ['uid', 'datum'],
			getJson: {
				datum: 'searchDatum'
			}
		},
		detail: {
			url: 'https://lab-quade.de/fahrdienst_app/tour_detail_admin.php',
			template: 'detailListA',
			getKeys: ['uid', 'tour_id']
		}
	}

	import {
		uid,
		rhId,
		tourId,
		fid,
		fro,
		fahrer,
		alertList
	} from '../lib/storage'
	import getApiKey from '../lib/getApiKey'
	import sleep from '../lib/utils/sleep'
	const adapt = [
		['Frei', 'badge-success'],
		['In Arbeit', 'badge-warning'],
		['Leer', ''],
		['Beendet', 'badge-neutral']
	]
	const { datum } = getApiKey()
	let searchDate = $state('')
	async function sucheDaten() {
		const url = `${settings.header.url}?uid=${$uid}&datum=${searchDate}`

		try {
			const response = await fetch(url, getHeader)
			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`)
			}

			const { data, error } = await response.json()

			if (error) {
				console.log('Error', error)
				throw new Error(error)
			}

			if (data) {
				console.log('Search Data', Object.keys(data[0]).join(','))
				return data
			}
		} catch (error) {
			console.error('Fehler beim Abrufen der Daten:', error)
			throw new Error(error)
		}
	}

	let promiseHeader = $state(sleep(10).then(() => []))
</script>

<section class="nwp page">
	<article class="flex flex-col gap-4">
		<h4>Suche</h4>
		<div class="split rounded-box bg-base-100 p-4 shadow-md">
			<div class="flex flex-col gap-1">
				<label>Datum</label>
				<input type="date" bind:value={searchDate} id="" class="input" />
			</div>
			<nav class="self-end">
				<button
					class="btn"
					onclick={() => {
						promiseHeader = sucheDaten(searchDate)
					}}>Suche</button>
			</nav>
		</div>

		{#await promiseHeader}
			<div>
				<span>...loading</span>
			</div>
		{:then daten}
			<div class="list rounded-box bg-base-100 shadow-md">
				<div class="p-4 pb-2 text-sm tracking-wide opacity-60">Routenliste</div>
				{#each daten as { Routentyp, Routenname, Fahrer, Boxen, inuse, RH_ID, Zusatzinfo, History, Kommentar }, id (id)}
					<div class="list-row items-center">
						<div class="list-col-grow">
							<h5>{Routenname}</h5>
						</div>
						<div class="nav">
							<span class="badge {adapt[inuse][1]}">{adapt[inuse][0]}</span>
						</div>
					</div>
				{:else}
					<div class="list-row">
						<div class="list-col-grow">
							<div>Nichts gefunden</div>
						</div>
					</div>
				{/each}
			</div>
		{/await}
	</article>
</section>
