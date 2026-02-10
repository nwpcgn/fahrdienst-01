<script lang="ts">
	let { children, showSb = $bindable() } = $props()
</script>

<aside
	class="fixed inset-0 z-40 transform overflow-hidden border bg-base-200 transition-all duration-400 ease-in"
	class:opacity-50={!showSb}
	class:translate-x-full={!showSb}>
	<button
		class="btn absolute top-2 right-2 btn-circle btn-neutral"
		onclick={() => (showSb = false)}
		aria-label="Close Sidebar">
		{@render iconT('fd-close')}
	</button>
	<div class="content flex flex-col gap-4 overflow-auto">
		{@render children?.()}
	</div>
</aside>
{#snippet iconT(name)}
	<svg class="nwp-icon"><use xlink:href="#{name}"></use></svg>
{/snippet}
