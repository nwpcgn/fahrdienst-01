<script lang="ts">
	import { tourId } from './lib/storage'
	let {
		laufende_nummer,
		eins_kuerzel,
		eins_name,
		eins_strasse,
		eins_plz,
		eins_ort,
		eins_telefon,
		eins_bedarf,
		eins_info,
		eins_boxen,
		material,
		befunde,
		proben,
		id,
		visited = $bindable(),
		onSubmit
	} = $props()
	let rBefunde = $state(befunde || 2)
	let rMaterial = $state(material || 2)
	let rProben = $state(proben || 2)

	// let isDisabled = $derived(listId != laufende_nummer)
	let isBox = $derived(parseInt(eins_boxen))
	// $effect(() => {
	// 	if (listId == id && elem) {
	// 		elem.scrollIntoView({
	// 			behavior: 'smooth',
	// 			block: 'start',
	// 			inline: 'nearest'
	// 		})
	// 	}
	// })

	// const arrayToSave = Array.from(mySet)
</script>

<li
	class="list-row"
	style="--radius-box: 0;"
	class:bg-base-300={visited.has(id)}
	class:grayscale={visited.has(id)}>
	<div>
		<div class="text-sm font-thin text-neutral">
			{eins_kuerzel}
		</div>
		<div class="text-2xl font-thin tabular-nums">
			{laufende_nummer}
		</div>
		{#if eins_bedarf}
			<div class="badge badge-xs badge-success">Bedarf</div>
		{/if}
	</div>
	<div class="text-base" style="--fs: 16px;">
		<div class="line-clamp-4 font-bold">
			{@html eins_name.replaceAll('\n', '<br>')}
		</div>
		<div>{eins_strasse}</div>
		<div>{eins_plz} {eins_ort}</div>
		{#if eins_telefon}
			<a class="nav text-info" href="tel: {eins_telefon.replace('0', '+49')}"
				><svg class="nwp-icon fd-phone"><use xlink:href="#fd-phone"></use></svg>
				<span>{eins_telefon.replace('0', '+49')}</span></a>
		{/if}
		<div>
			<a
				class="nav text-info"
				href="https://maps.google.de/?daddr={eins_strasse}+{eins_plz}+{eins_ort}&saddr=My+Location"
				target="_blank"
				rel="noreferrer"
				><svg class="nwp-icon"><use xlink:href="#fd-compass"></use></svg>
				<span>Map</span></a>
		</div>
	</div>
	{#if isBox || eins_info}
		<div class="list-col-wrap space-y-2">
			{#if isBox}
				{@render boxT()}
			{/if}
			{#if eins_info}
				{@render infoT()}
			{/if}
		</div>
	{/if}
	<div>
		{@render callBackForm()}
	</div>

	<div class="list-col-wrap text-xs">
		<button
			onclick={() => {
				onSubmit({
					eins_kuerzel,
					befunde: rBefunde,
					material: rMaterial,
					proben: rProben
				})
				visited.add(id)
				const arrayToSave = Array.from(visited)
				tourId.set(arrayToSave)
			}}
			class="btn btn-sm btn-info">
			Senden
		</button>
	</div>
</li>

{#snippet boxT()}
	<div class="flex items-center gap-2 rounded-box bg-error/20 p-2 text-error">
		{@render iconT('fd-error')}
		<span>{eins_boxen} Box{isBox > 1 ? 'en' : ''}</span>
	</div>
{/snippet}
{#snippet infoT()}
	<div class="flex items-center gap-2 rounded-box bg-info/20 p-2 text-info">
		{@render iconT('fd-info')}
		<span>{eins_info}</span>
	</div>
{/snippet}

{#snippet callBackForm()}
	<fieldset class="fieldset rounded-lg border border-info p-2">
		<label class="split cursor-pointer">
			<span class="text-base font-bold">B</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rBefunde = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox"
				checked={rBefunde == 1} />
		</label>
		<label class="split cursor-pointer">
			<span class="text-base font-bold">M</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rMaterial = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox"
				checked={rMaterial == 1} />
		</label>

		<label class="split cursor-pointer">
			<span class="text-base font-bold">P</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rProben = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox"
				checked={rProben == 1} />
		</label>
	</fieldset>
{/snippet}

{#snippet iconT(name)}
	<svg class="nwp-icon icon-sm"><use xlink:href="#{name}"></use></svg>
{/snippet}
