<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity'
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
		listId = $bindable(1),
		onSubmit
	} = $props()
	let visited = new SvelteSet<number>()
	let rBefunde = $state(2)
	let rMaterial = $state(2)
	let rProben = $state(2)
	let elem: HTMLDivElement = $state()
	let isDisabled = $derived(listId != laufende_nummer)
	let isBox = $derived(parseInt(eins_boxen))
	$effect(() => {
		if (listId == laufende_nummer && elem) {
			elem.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			})
		}
	})
</script>

<!-- <div class="split py-4">
	<div class="flex flex-col">
		{@html eins_name.replaceAll('\n', '<br>')}
	</div>
	<div class="flex flex-col">
		{@render callBackForm()}
		<button
			class="btn"
			onclick={() => {
				console.log({
					eins_kuerzel,
					befunde: rBefunde,
					material: rMaterial,
					proben: rProben
				})
				onSubmit({
					eins_kuerzel,
					befunde: rBefunde,
					material: rMaterial,
					proben: rProben
				})
			}}>Submit</button>
	</div>
</div> -->

<li bind:this={elem} class="list-row" class:bg-base-300={visited.has(laufende_nummer)} class:grayscale={visited.has(laufende_nummer)}>
	
	<div> 
		<div class="text-sm font-thin text-neutral">
			{eins_kuerzel}
		</div>
		<div class="text-2xl font-thin tabular-nums">
			{laufende_nummer}
		</div>
	</div>
	<div>
		<div class="line-clamp-2 font-bold">
			{@html eins_name.replaceAll('\n', '<br>')}
		</div>
		<div>{eins_strasse}</div>
		<div>{eins_plz} {eins_ort}</div>
		{#if eins_telefon}
			<a class="text-info" href="tel: {eins_telefon.replace('0', '+49')}"
				>{eins_telefon.replace('0', '+49')}</a>
		{/if}
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
	{@render callBackForm()}
	<div class="list-col-wrap text-xs">
		<button
			onclick={() => {
				console.log({
					eins_kuerzel,
					befunde: rBefunde,
					material: rMaterial,
					proben: rProben
				})
				onSubmit({
					eins_kuerzel,
					befunde: rBefunde,
					material: rMaterial,
					proben: rProben
				}) 
				visited.add(laufende_nummer)
			}}
			class="btn btn-soft btn-sm btn-info">
			Submit
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
	<fieldset class="fieldset rounded-box border border-info p-2">
		<label class="split cursor-pointer">
			<span class="text-base font-bold">M</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rMaterial = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox" />
		</label>
		<label class="split cursor-pointer">
			<span class="text-base font-bold">B</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rBefunde = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox" />
		</label>

		<label class="split cursor-pointer">
			<span class="text-base font-bold">P</span>
			<input
				onchange={(e) => {
					// const isChecked = e.currentTarget.checked
					rProben = e.currentTarget.checked ? 1 : 2
				}}
				type="checkbox" />
		</label>
	</fieldset>
{/snippet}

{#snippet iconT(name)}
	<svg class="nwp-icon icon-sm"><use xlink:href="#{name}"></use></svg>
{/snippet}
