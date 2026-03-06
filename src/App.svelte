<script lang="ts">
	import Lobby from './Lobby.svelte'

	import ArztSuche from './ArztSuche.svelte'

	import { location, Router, Route } from '@svelte-router/core'
	import Auth from './Auth.svelte'
	import FahrDienst from './FahrDienst.svelte'
	import FahrInfo from './FahrInfo.svelte'
	import FahrInfoDetail from './FahrInfoDetail.svelte'
	import getApiKey from './lib/getApiKey'
	import {
		alertList,
		Alerts,
		fahrer,
		fid,
		fro,
		IconView,
		nav,
		pageAdapt,
		rhId,
		routeLength,
		routeStore,
		sleep,
		Spinner,
		Sprites,
		tourId,
		TourReset,
		uid
	} from './lib'

	const VERS = 'v0.3.01'
	let showSb = $state(false)
	let iconList = $state([])
	let searchDate = $state('')
	const init = async () => {
		await sleep()
		const { key } = getApiKey()
		console.log(VERS)
		if ($uid && $uid === key) {
			console.log('Same Day')
			if (!$rhId) {
				tourId.set([])
			}
		} else {
			console.log('New Day')
			uid.set(key)
			rhId.set(0)
			alertList.set([])
			tourId.set([])
		}

		showSb = false
		await sleep(2000)
		return 'ready'
	}
	let promise = $state(init())
	let current = $derived(location.url.hash.replace('#', '') || '/')
	let page = $derived(pageAdapt[current])
	let label = $derived(page?.name || 'Fahrinfo')
	$effect(() => {
		if (current) {
			showSb = false
		}
	})
</script>

{#await promise}
	<Spinner></Spinner>
{:then value}
	<Auth>
		<Router id="root">
			<div class="drawer drawer-end flex-1 overflow-hidden">
				<input
					id="my-drawer-1"
					type="checkbox"
					class="drawer-toggle"
					bind:checked={showSb} />
				<div class="drawer-content flex flex-col overflow-hidden">
					{@render appBar()}
					<main class="main" data-status={value}>
						<Route path="/" key="lobby">
							<Lobby></Lobby>
						</Route>
						<Route path="/dienst" key="dienst">
							<FahrDienst></FahrDienst>
						</Route>

						<Route path="/info" key="info">
							<FahrInfo bind:searchDate></FahrInfo>
						</Route>
						<Route path="/info/:rid" key="info-detail">
							{#snippet children({ rp })}
								<FahrInfoDetail {searchDate} rid={rp?.rid}></FahrInfoDetail>
							{/snippet}
						</Route>
						<Route path="/search" key="search">
							<!-- 	<IconView {iconList}></IconView> -->
							<ArztSuche></ArztSuche>
						</Route>
					</main>
				</div>
				{@render sideBar()}
			</div>
		</Router>
		<Alerts />
	</Auth>
{/await}
<footer id="portals"></footer>
<Sprites bind:iconList />

{#snippet sideBar()}
	<aside class="drawer-side">
		<label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay"
		></label>
		<div class="flex min-h-full flex-col bg-base-200 p-4">
			<ul class="menu w-80">
				<li class="menu-title">Navigation</li>
				{#each nav as { name, href, icon, slug, disabled } (slug)}
					{#if disabled != $fro}
						<li
							class:text-accent={current === href}
							class:italic={current === href}>
							<a href="#{href}" class="split">
								<span class="font-semibold">{name}</span>
								<span>{@render iconT(icon)}</span>
							</a>
						</li>
					{/if}
				{/each}

				<li class="menu-title">Application</li>
				<li>
					<a
						href="#/"
						onclick={(e) => {
							e.preventDefault()
							window.location.reload()
						}}
						class="split text-primary">
						<strong>Refresh</strong>
						<span>{@render iconT('fd-refresh')}</span>
					</a>
				</li>
				<TourReset
					onSuccess={() => {
						showSb = false
						location.navigate('/dienst')
						rhId.set(0)
						console.log('Tour Reset')
					}}></TourReset>
			</ul>

			<div class="flex-1"></div>
			<ul class="menu w-80">
				<li class="menu-title">User</li>
				<li>
					<a
						class="split text-error"
						href="#/"
						onclick={(e) => {
							e.preventDefault()
							fid.set(0)
							fro.set(0)
							fahrer.set('')
							showSb = false
						}}>
						<strong>Logout</strong>
						{@render iconT('fd-log-out')}
					</a>
				</li>
			</ul>
			<button
				onclick={() => (showSb = false)}
				class="btn absolute top-4 right-4 z-20 btn-circle btn-ghost btn-sm"
				aria-label="Close">
				{@render iconT('fd-close')}
			</button>
		</div>
	</aside>
{/snippet}

{#snippet appBar()}
	<div class="navbar bg-primary px-4 text-primary-content shadow-sm">
		<div class="nav flex-1">
			{#if current.includes('/dienst') && $rhId}
				{@render iconT('fd-car')}<span>{$routeStore?.Routenname}</span>
				{@render iconT('fd-box')}<span>{$routeStore?.Boxen}</span>
				{@render iconT('fd-map')}<span>
					<span class="opacity-70">{$tourId.length}</span> /
					<span>{$routeLength}</span>
				</span>
			{:else}
				<button
					class="btn-nwp text-xl font-bold"
					onclick={() => location.navigate('/')}>{label}</button>
			{/if}
		</div>
		<div class="flex-none">
			<button
				class="btn btn-circle btn-primary"
				onclick={() => (showSb = true)}
				aria-label="SideBar Toggle">
				<svg class="nwp-icon fd-burger"
					><use xlink:href="#fd-burger"></use></svg>
			</button>
		</div>
	</div>
{/snippet}
{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
