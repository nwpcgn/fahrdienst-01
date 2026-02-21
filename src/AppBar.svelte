<script lang="ts">
	import { rhId, tourId, routeStore, routeLength } from './lib/storage.ts'
	let { showSb = $bindable(false) } = $props()

	const btnClass = `btn btn-circle btn-ghost ${showSb ? 'btn-active' : ''}`
</script>

<div class="bg-[#3871C2] text-white shadow-sm">
	<nav class="content is-flat navbar">
		<div class="nav flex-1 text-xl font-bold">
			{#if $rhId}
				{@render iconT('fd-car')}<span>{$routeStore?.Routenname}</span>
				{@render iconT('fd-box')}<span>{$routeStore?.Boxen}</span>
				{@render iconT('fd-map')}<span
					><span class="opacity-70">{$tourId.length}</span>/{$routeLength}</span>
			{:else}
				<span class="">Fahrdienst</span>
			{/if}
		</div>
		<div class="flex gap-1">
			<button
				onclick={() => {
					showSb = !showSb
				}}
				class={btnClass}
				aria-label="Info">
				{@render iconT('fd-burger')}
			</button>
		</div>
	</nav>
</div>

{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
