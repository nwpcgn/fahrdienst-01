<script lang="ts">
	import Admin from './admin/Admin.svelte'

	import Auth from './Auth.svelte'
	import Alerts from './Alerts.svelte'
	import TourReset from './TourReset.svelte'
	import SideBar from './SideBar.svelte'
	import AppBar from './AppBar.svelte'
	import DetailList from './DetailList.svelte'
	import HeaderList from './HeaderList.svelte'
	import {
		uid,
		rhId,
		tourId,
		fid,
		fro,
		fahrer,
		alertList
	} from './lib/storage.ts'
	import Sprites from './lib/components/Sprites.svelte'
	import getApiKey from './lib/getApiKey'
	const VERS = 'v0.2.09'
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

		showSb = false
	}
	let promise = $state(init())
</script>

<Auth>
	<AppBar bind:showSb></AppBar>
	<main class="main">
		{#await promise}
			<section class="nwp page center">
				<div>
					<span>Loading</span>
				</div>
			</section>
		{:then _}
			{#if $fro == 3}
				{@render role1Temp()}
				<!-- 	<Admin></Admin> -->
			{:else if $fro == 2}
				{@render role1Temp()}
				<!-- <section class="nwp page">
					<article>
						<span>Role 2</span>
					</article>
				</section> -->
			{:else}
				{@render role1Temp()}
			{/if}
		{/await}
	</main>

	<SideBar bind:showSb>
		<h4>Info</h4>
		<ul>
			<li>UID: {$uid ? 'True' : 'False'}</li>
			<li>RH_ID: {$rhId}</li>
			<li>Visited: {$tourId?.length ?? 0}</li>
			<li>Alerts: {$alertList?.length}</li>
			<li>Version: {VERS}</li>
		</ul>

		<nav class="flex gap-4">
			<button
				onclick={() => {
					fid.set(0)
					fahrer.set('')
					showSb = false
				}}
				class="btn btn-soft btn-error"
				>{@render iconT('fd-log-out')}
				<span>Logout</span></button>
			<button
				onclick={() => {
					showSb = false
					location.reload()
				}}
				class="btn btn-soft btn-info">
				{@render iconT('fd-refresh')}
				<span>Refresh</span>
			</button>
		</nav>
		<TourReset
			onSuccess={() => {
				tourId.set([])
				rhId.set(0)
				alertList.set([])
				promise = init()
				showSb = false
			}}></TourReset>
		<div class="flex flex-col gap-4">
			{#each $alertList as item}
				<div role="alert" class="alert alert-info">
					{@render iconT('fd-info')}
					<span>{item}</span>
				</div>
			{/each}
		</div>
	</SideBar>
</Auth>

<div id="portals"></div>
<Sprites />
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}

{#snippet role1Temp()}
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
{/snippet}
