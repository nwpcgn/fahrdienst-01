<script lang="ts">
	import DetailList from './DetailList.svelte'
	import HeaderList from './HeaderList.svelte'
	import { uid, rhId, tourId } from './lib/storage.ts'
	import Sprites from './lib/components/Sprites.svelte'
</script>

<div class="layout">
	<main class="main">
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

		<aside class="aside">
			<div class="panel">
				<article>
					<h4>Aside</h4>
					<ul>
						<li>UID: {$uid}</li>
						<li>RH_ID: {$rhId}</li>
						<li>tourId: {$tourId}</li>
					</ul>
					<nav class="nav">
						<button
							class="btn btn-error"
							onclick={() => {
								tourId.set(0)
								rhId.set(0)
							}}>Reset R</button>
					</nav>
				</article>
			</div>
		</aside>
	</main>
</div>

<Sprites />
