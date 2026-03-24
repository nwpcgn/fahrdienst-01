<script lang="ts">
	import { getDetailGet } from './fetchData'
	import { onMount } from 'svelte'
	import { SvelteSet, SvelteURLSearchParams } from 'svelte/reactivity'
	import DetailItem from './detailItem.svelte'
	import getApiKey from './getApiKey'
	import {
		fetchHeaderPost,
		fid,
		rhId,
		routeStore,
		settings,
		sleep,
		TourEnde,
		tourId,
		uid,
		routeLength
	} from './'

	let { children } = $props()
	let visited = new SvelteSet<number>()
	let pageEl: HTMLElement = $state()

	const handleDetailSubmit = async ({ rd_id, befunde, material, proben }) => {
		const { time, datum } = getApiKey()
		const formData = new SvelteURLSearchParams()
		formData.append('uid', $uid)
		formData.append(
			'json_input',
			JSON.stringify({
				RD_ID: `${rd_id}`,
				befunde: `${befunde}`,
				material: `${material}`,
				proben: `${proben}`,
				Fahrer_ID: `${$fid}`,
				erledigt_um: `${datum} ${time}`
			})
		)
		try {
			const response = await fetch(settings.fahrer.detail.url, {
				method: 'POST',
				body: formData.toString(),
				headers: fetchHeaderPost
			})

			const { info, error } = await response.json()

			if (info) {
				console.log(`Tour Step ${rd_id} wurde übergeben: `, info)
				return info
			}
			if (error) {
				alert(JSON.stringify(error))
				throw new Error(error)
			}
		} catch (f) {
			console.error('Fehler:', f)
		}
	}
	const initDetails = async () => {
		await sleep()
		try {
			const url = `${settings.fahrer.detail.url}?uid=${$uid}&tour_id=${$rhId}`
			const data = await getDetailGet(url)
			routeLength.set(data.length)
			return data
		} catch (error) {
			console.log(error)
		}
	}
	const toTop = () => {
		if (!pageEl) return

		// console.log('scrollHeight:', pageEl.scrollHeight)
		// console.log('clientHeight:', pageEl.clientHeight)
		// console.log('scrollTop:', pageEl.scrollTop)

		// const maxScroll = pageEl.scrollHeight - pageEl.clientHeight
		// console.log('max scroll:', maxScroll)

		pageEl.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const toEnd = () => {
		if (!pageEl) return
		// openKommentar = true
		const maxScroll = pageEl.scrollHeight - pageEl.clientHeight
		pageEl.scrollTo({ top: maxScroll, behavior: 'smooth' })
	}

	const actMenu = [
		// {
		// 	name: 'Main Menu',
		// 	icon: 'fd-burger',
		// 	action: toTop
		// },
		{
			name: 'Beenden',
			icon: 'fd-down',
			action: toEnd
		},
		{
			name: 'To Top',
			icon: 'fd-top',
			action: toTop
		}
	]
	let openKommentar = $state(false)
	let promise = $state(sleep(100))

	onMount(() => {
		if ($tourId) {
			visited = new SvelteSet<number>($tourId)
			// console.log('Visited from tourId:', visited)
		}
		promise = initDetails()
	})
</script>

<section bind:this={pageEl} class="nwp page">
	{#await promise}
		{@render loadingSpinner()}
	{:then value}
		<article>
			{#if value}
				{#if $routeStore?.Zusatzinfo}
					<div class="mb-4 alert alert-warning shadow-lg">
						{@render iconT('fd-info')}
						<span>{$routeStore?.Zusatzinfo}</span>
					</div>
				{/if}
				<ul class="list bg-base-100 shadow-md">
					<li class="p-4 pb-2 text-sm tracking-wide opacity-60">Tourenliste</li>
					{#each value as item (item.rd_id)}
						<DetailItem {...item} onSubmit={handleDetailSubmit} bind:visited
						></DetailItem>
					{/each}
				</ul>

				<TourEnde bind:isOpen={openKommentar}></TourEnde>
			{/if}
		</article>
		{@render children?.()}
	{/await}

	<div class="fab">
		<!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
		<div tabindex="0" role="button" class="btn btn-circle btn-lg btn-primary">
			M
		</div>
		{#each actMenu as { name, icon, action }, i (i)}
			<div>
				{name}
				<button
					class="btn btn-circle btn-lg btn-secondary"
					onclick={() => {
						action?.()
					}}
					aria-label="Action {i}">
					{@render iconT(icon)}
				</button>
			</div>
		{/each}
	</div>
</section>

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}

{#snippet loadingSpinner()}
	<div class="grid h-[400px] place-content-center">
		<div class="sr-only">...loading</div>
		<span class="loading loading-xl loading-spinner text-primary"></span>
	</div>
{/snippet}
