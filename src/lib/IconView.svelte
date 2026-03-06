<script lang="ts">
	import { Dialog, sleep, copyToClip } from './'
	let { iconList = [], iconSize = 80 } = $props()
	let showModal = $state(false)
	const showIconInfo = async (detail) => {
		await sleep(200)
		showModal = true
		return detail
	}

	let preProm = $state(sleep())
</script>

<section class="nwp page">
	<article
		class="padded img-grid"
		style="--min: {iconSize + 20}px; --gap: 2rem;">
		{#each iconList as { icon, title }, id (id)}
			<button
				data-id={id}
				class="cursor-pointer rounded-box active:bg-info/20"
				onclick={() => {
					preProm = showIconInfo({ id, icon, title })
				}}>
				<figure>
					{@render iconT(icon, iconSize)}
					<figcaption>{title}</figcaption>
				</figure>
			</button>
		{/each}
	</article>
	<div class="padded">
		<button
			class="btn btn-primary"
			onclick={() => {
				copyToClip(JSON.stringify(iconList))
			}}>Copy List</button>
	</div>
</section>
<Dialog bind:showModal>
	{#await preProm then value}
		{#if value}
			{@render iconPre(value)}
		{/if}
	{/await}
</Dialog>

{#snippet iconPre({ icon, title })}
	<div class="nav">
		<figure>
			{@render iconT(icon, 60)}
		</figure>
		<div class="stack-list flex-1 px-4">
			<h2 class="font-bold tracking-widest uppercase">{title}</h2>
			<div>
				<pre
					class="inline-block rounded-box bg-base-300 px-4 py-1 font-bold">{icon}</pre>
			</div>
		</div>
	</div>
	<div class="modal-action">
		<form method="dialog">
			<!-- if there is a button, it will close the modal -->
			<button class="btn btn-soft btn-primary" onclick={() => copyToClip(icon)}
				>Copy Icon Id</button>
			<button class="btn btn-soft btn-secondary">Close</button>
		</form>
	</div>
{/snippet}

{#snippet iconT(name, size)}
	{#if size}
		<svg width={size} height={size}><use xlink:href="#{name}"></use></svg>
	{:else}
		<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
	{/if}
{/snippet}
