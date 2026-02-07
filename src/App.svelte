<script lang="ts">
	import Alerts from './Alerts.svelte'
	import TourReset from './TourReset.svelte'
	import SideBar from './SideBar.svelte'
	import AppBar from './AppBar.svelte'
	import DetailList from './DetailList.svelte'
	import HeaderList from './HeaderList.svelte'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import Sprites from './lib/components/Sprites.svelte'
	import getApiKey from './lib/getApiKey'
	const VERS = 'v0.2.06'
	let isAuthenticated = $state(false)
	let username = $state('')
	let password = $state('')
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
			tourId.set([])
		}
	}
	let promise = $state(init())
</script>

{#if !isAuthenticated}
	<main class="main">
		<section class="nwp page center">
			<div>
				<fieldset
					class="fieldset w-xs rounded-box border border-base-300 bg-base-200 p-4">
					<legend class="fieldset-legend">Login</legend>

					<label class="label">Username</label>
					<input
						bind:value={username}
						type="text"
						class="input"
						placeholder="Username" />

					<label class="label">Password</label>
					<input
						bind:value={password}
						type="password"
						class="input"
						placeholder="Password" />

					<button
						class="btn mt-4 btn-neutral"
						onclick={() => {
							isAuthenticated = true
						}}>Login</button>
				</fieldset>
			</div>
		</section>
	</main>
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
			<li>Version: {VERS}</li>
		</ul>
		<TourReset
			onSuccess={() => {
				tourId.set([])
				rhId.set(0)
				promise = init()
				showSb = false
			}}></TourReset>
	</SideBar>
{/if}
<Sprites />
