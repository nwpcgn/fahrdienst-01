<script lang="ts">
	import SideBar from './SideBar.svelte'
	import AppBar from './AppBar.svelte'
	import DetailList from './DetailList.svelte'
	import HeaderList from './HeaderList.svelte'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import Sprites from './lib/components/Sprites.svelte'
	import getApiKey from './lib/getApiKey'
	const VERS = 'v0.2.04'
	let showSb = $state(false)
	const init = async () => {
		const { key } = getApiKey()
		console.log(VERS);
		if ($uid && $uid === key) {
			if (!rhId) {
				tourId.set([])
			}
			console.log('Same Day', $uid, $rhId, $tourId)
		} else {
			console.log('New Day')
			uid.set(key)
			rhId.set(0)
			tourId.set([])
		}
	}
	let promise = $state(init())
</script>

<AppBar bind:showSb></AppBar>

<main class="main">
	{#await promise}
		<section class="nwp page center">
			<div>
				<span>Loading</span>
			</div>
		</section>
	{:then value}
		{#if !$rhId}
			<section class="nwp page">
				<article>
					<HeaderList></HeaderList>
				</article>
			</section>
		{:else}
			<section class="nwp page">
				<article>
					<DetailList></DetailList>
				</article>
			</section>
		{/if}
	{:catch error}
		<section class="nwp center page">
			<div>
				<h4 class="text-error">Error</h4>
			</div>
		</section>
	{/await}
</main>

<div id="portals"></div>

<SideBar bind:showSb>
	<h4>Info</h4>
	<ul>
		<li>UID: {$uid}</li>
		<li>RH_ID: {$rhId}</li>
	</ul>
	<nav class="nav">
		<button
			class="btn btn-error"
			onclick={() => {
				tourId.set([])
				rhId.set(0)
				promise = init()
			}}>Reset R</button>
	</nav>
</SideBar>

<Sprites />
