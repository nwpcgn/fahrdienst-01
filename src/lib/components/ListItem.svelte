<script lang="ts">
	let {
		laufende_nummer,
		eins_kuerzel,
		eins_name,
		eins_strasse,
		eins_plz,
		eins_ort,
		eins_info,
		eins_boxen,
		material,
		befunde,
		proben,
		listId = $bindable(),
		onSubmit
	} = $props()
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

<li
	bind:this={elem}
	class="list-row"
	class:grayscale={isDisabled}
	class:pointer-events-none={isDisabled}
	class:blur-[2px]={isDisabled}>
	<div>
		<div class="text-sm font-thin text-neutral">
			{eins_kuerzel}
		</div>
		<div class="text-2xl font-thin tabular-nums">
			{laufende_nummer}
		</div>
	</div>
	<div>
		<div class="line-clamp-2 font-bold">{eins_name}</div>
		<div>{eins_strasse}</div>
		<div>{eins_plz} {eins_ort}</div>
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
				onSubmit({
					eins_kuerzel,
					befunde,
					material,
					proben
				})
			}}
			class="btn btn-soft btn-sm btn-info">
			Ready
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
			<span class="text-base font-bold">B</span>
			<input
				onchange={(e) => {
					const isChecked = e.currentTarget.checked
					befunde = isChecked ? 1 : 0
				}}
				type="checkbox"
				checked={befunde} />
		</label>
		<label class="split cursor-pointer">
			<span class="text-base font-bold">M</span>
			<input
				onchange={(e) => {
					const isChecked = e.currentTarget.checked
					material = isChecked ? 1 : 0
				}}
				type="checkbox"
				checked={material} />
		</label>
		<label class="split cursor-pointer">
			<span class="text-base font-bold">P</span>
			<input
				onchange={(e) => {
					const isChecked = e.currentTarget.checked
					proben = isChecked ? 1 : 0
				}}
				type="checkbox"
				checked={proben} />
		</label>
	</fieldset>
{/snippet}

{#snippet iconT(name)}
	<svg class="nwp-icon icon-sm"><use xlink:href="#{name}"></use></svg>
{/snippet}
