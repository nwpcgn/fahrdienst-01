<script lang="ts">
	import { settings, uid, infoStore } from './lib'
	import DetailItemInfo from './lib/detailItemInfo.svelte'
	import { getDetailGet } from './lib/fetchData'
	let { rid } = $props()
	const initDetails = async () => {
		try {
			const url = `${settings.admin.detail.url}?uid=${$uid}&tour_id=${rid}`
			const data = await getDetailGet(url)
			// console.log({ data })
			const summe = data.reduce((accumulator, currentValue) => {
				return accumulator + currentValue.erledigt
			}, 0)
			infoStore.update((s) => {
				return { ...s, summe, tourlaenge: data.length }
			})

			return data
		} catch (error) {
			console.log(error)
		}
	}
	let promise = $state(initDetails())
</script>

<section class="nwp page">
	{#await promise then value}
		{@render topBar()}
		<article>
			{#if $infoStore?.Zusatzinfo}
				<div class="mb-4 alert alert-warning shadow-lg">
					{@render iconT('fd-info')}
					<span>{$infoStore?.Zusatzinfo}</span>
				</div>
			{/if}
			<ul class="list bg-base-100 shadow-md">
				<li class="p-4 pb-2 text-sm tracking-wide opacity-60">Tourenliste</li>
				{#each value as item, i (i)}
					<DetailItemInfo {...item}></DetailItemInfo>
				{/each}
			</ul>

			<div class="padded shadow-md">
				<h4>Kommentar</h4>
				<div>{@html $infoStore.Kommentar.replaceAll('\n', '<br>')}</div>
				<h4>Historie</h4>
				<div>{@html $infoStore.History.replaceAll('\n', '<br>')}</div>
			</div>
		</article>
	{/await}
</section>
{#snippet topBar()}
	<article>
		<div class="split rounded-box bg-base-100 p-4 shadow-md">
			<button class="btn-nwp" onclick={() => history.back()}>
				{@render iconT('fd-undo', 18)}
				<span>Zurück</span>
			</button>
			<div></div>
		</div>
	</article>
{/snippet}

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
