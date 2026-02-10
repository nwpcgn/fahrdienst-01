<script lang="ts">
	import Auth from './Auth.svelte'

	import Alerts from './Alerts.svelte'
	import TourReset from './TourReset.svelte'
	import SideBar from './SideBar.svelte'
	import AppBar from './AppBar.svelte'
	import DetailList from './DetailList.svelte'
	import HeaderList from './HeaderList.svelte'
	import { uid, rhId, tourId, fid, fahrer, alertList } from './lib/storage.ts'
	import Sprites from './lib/components/Sprites.svelte'
	import getApiKey from './lib/getApiKey'
	const VERS = 'v0.2.07'
	let isAuthenticated = $state(false)

	let showSb = $state(false)
	const init = async () => {
		const { key } = getApiKey()
		console.log(VERS)
		if ($uid && $uid === key) {
			if (!rhId) {
				tourId.set([])
			}
			console.log('Same Day', $uid, $rhId, $tourId)
		} else {
			console.log('New Day')
			uid.set(key)
			rhId.set(0)
			alertList.set([])
			tourId.set([])
		}
	}
	let promise = $state(init())
</script>

{#if !$fid}
	<Auth bind:isAuthenticated></Auth>
{:else}
	<AppBar bind:showSb></AppBar>

	<main class="main">
		{#await promise}
			<section class="nwp page center">
				<div>
					<span>Loading</span>
				</div>
			</section>
		{:then _}
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
				<Alerts></Alerts>
			{/if}
		{/await}
	</main>

	<div id="portals"></div>

	<SideBar bind:showSb>
		<h4>Info</h4>
		<ul>
			<li>UID: {$uid ? 'True' : 'False'}</li>
			<li>RH_ID: {$rhId}</li>
			<li>Visited: {$tourId?.length ?? 0}</li>
			<li>Alerts: {$alertList?.length}</li>
			<li>Version: {VERS}</li>
		</ul>
		<TourReset
			onSuccess={() => {
				tourId.set([])
				rhId.set(0)
				alertList.set([])
				promise = init()
				showSb = false
			}}></TourReset>

		<nav>
			<button
				onclick={() => {
					fid.set(0)
					fahrer.set('')
				}}
				class="btn btn-error">Logout</button>
		</nav>
		<div class="flex flex-col gap-4">
			{#each $alertList as item}
				<div role="alert" class="alert alert-info">
					{@render iconT('fd-info')}
					<span>{item}</span>
				</div>
			{/each}
		</div>
	</SideBar>
{/if}
<Sprites />
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
