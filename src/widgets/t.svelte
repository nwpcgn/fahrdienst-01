<script lang="ts">
	import { app, wizard } from './lib/app.svelte.ts'
	import IconShow from './widgets/IconShow.svelte'
	import { copyToClip, sleep } from './lib'
	import type { Tour, TourStop, TourCallBack, Icons } from './lib/types'
	import Dialog from './lib/components/Dialog.svelte'
	import { options } from './lib/storage'
	import { get } from 'svelte/store'
	import Sprites from './lib/components/Sprites.svelte'
	import Page from './lib/components/Page.svelte'
	const btnClass =
		'btn btn-soft btn-circle transition-all duration-200 ease transform active:scale-95'
	let op = get(options)
	const icon1 = 52
	let dialogContent = $state({
		snippet: iconTemp,
		props: {
			slug: 'map',
			name: 'Map',
			icon: 'fd-map'
		}
	})

	const showIconInfo = (detail: Icons) => {
		console.log('IconInfo', detail)
		dialogContent.snippet = iconTemp
		dialogContent.props = detail
		showModal = true
	}

	const views = {
		start: {
			slug: 'start',
			href: '/start',
			name: 'Routen',
			icon: 'fd-route',
			component: startTemplate
		},
		tour: {
			slug: 'tour',
			href: '/tour',
			name: 'Tour',
			icon: 'fd-map',
			component: tourTemplate
		},
		info: {
			slug: 'info',
			href: '/info',
			name: 'Info',
			icon: 'fd-info',
			component: infoTemplate
		}
	}
	let viewId = $state(Object.keys(views)?.[0])
	let view = $derived(views[viewId])

	let showModal = $state(false)
	const toggleModal = () => (showModal = !showModal)
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<span>daisyUI</span>
	</div>
	<div class="flex gap-1">
		{#each Object.values(views) as { name, icon, slug }, i (i)}
			<button
				onclick={() => {
					viewId = slug
				}}
				class={btnClass}
				class:btn-info={viewId === slug}
				aria-label={name}>
				{@render iconT(icon)}
			</button>
		{/each}
	</div>
</div>
<div class="layout">
	<div class="main">
		{@render view?.component?.({ ...view })}
	</div>
	<div class="aside">
		<div class="panel w-68">
			<IconShow onSelect={showIconInfo}></IconShow>
		</div>
		<Dialog bind:showModal>
			{@render dialogContent.snippet?.(dialogContent.props)}
		</Dialog>
	</div>
</div>
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
{#snippet startTemplate({ name, icon })}
	<Page>
		<header class="nav" style="--fs: 32px;">
			{@render iconT(icon)}
			<h1>{name}</h1>
		</header>
	</Page>
{/snippet}
{#snippet tourTemplate({ name, icon })}
	<Page>
		<header class="nav" style="--fs: 32px;">
			{@render iconT(icon)}
			<h1>{name}</h1>
		</header>
	</Page>
{/snippet}
{#snippet infoTemplate({ name, icon })}
	<Page>
		<header class="nav" style="--fs: 32px;">
			{@render iconT(icon)}
			<h1>{name}</h1>
		</header>
	</Page>
{/snippet}
{#snippet exT()}
	<div class="page">
		<article class="flex-1 shadow-sm">
			<button
				class="btn"
				onclick={() => {
					options.update((d) => {
						return { ...d, theme: 'light' }
					})
				}}>
				Set Data
			</button>
			<button class="btn" onclick={toggleModal}>Show Modal</button>
			<h4>Options</h4>
			<div>
				<textarea class="w-full" rows="5"
					>{JSON.stringify(op, null, 2)}</textarea>
				<textarea class="w-full" rows="5"
					>{JSON.stringify(wizard.get(), null, 2)}</textarea>

				<label class="input">
					key
					<input
						type="search"
						class="grow"
						placeholder="Search"
						value={$options.apiKey} />
					<kbd class="kbd kbd-sm">⌘</kbd>
					<kbd class="kbd kbd-sm">K</kbd>
				</label>
				<label class="input">
					<svg
						class="h-[1em] opacity-50"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<g
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke-width="2.5"
							fill="none"
							stroke="currentColor">
							<path
								d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
							></path>
							<path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
						</g>
					</svg>
					<input type="text" class="grow" placeholder="index.php" />
				</label>
				<label class="input">
					Path
					<input type="text" class="grow" placeholder="src/app/" />
					<span class="badge badge-xs badge-neutral">Optional</span>
				</label>
			</div>
		</article>
	</div>
{/snippet}

<Sprites></Sprites>

<div id="portals">
	<!-- modals will be appended here -->
</div>
{#snippet iconTemp({ slug, name, icon })}
	<div class="flex items-start gap-4">
		<figure class="rounded-full border-3 border-info p-4">
			<svg width={icon1} height={icon1}>
				<use xlink:href="#{icon}"></use>
			</svg>
		</figure>
		<article class="flex flex-1 flex-col gap-2">
			<h2>{name}</h2>
			<h5>{icon}</h5>
			<div
				class="w-full overflow-x-hidden rounded-box bg-neutral p-2 text-success-content">
				<pre>&lt;svg class=&quot;nwp-icon&quot;&gt;<br /> &lt;use xlink:href=&quot;#{icon}&quot;&gt;&lt;/use&gt;<br />&lt;/svg&gt;</pre>
			</div>
		</article>
	</div>
	<form class="modal-action" method="dialog">
		<button
			class="btn btn-info"
			onclick={async () => {
				await copyToClip(
					`<svg class="nwp-icon"><use xlink:href="#${dialogContent.props.icon}"></use></svg>`
				)
			}}>Copy</button>

		<!-- if there is a button in form, it will close the modal -->
		<button class="btn btn-neutral">Close</button>
	</form>
{/snippet}
{#snippet footer()}
	<div class="modal-action">
		<button
			onclick={() =>
				copyToClip(
					`<svg class="nwp-icon"><use xlink:href="#${icon}"></use></svg>`
				)}>Copy</button>
		<form method="dialog">
			s
			<button class="btn">Close</button>
		</form>
	</div>
{/snippet}
