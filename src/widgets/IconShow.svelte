<script lang="ts">
	import { icons } from '../lib/components/Sprites.svelte'
	let { onSelect } = $props()
</script>

<article class="img-grid">
	{#each icons as icon (icon.slug)}
		{@render iconFigure(icon)}
	{/each}
</article>

{#snippet iconFigure({ name, slug, icon })}
	<figure
		class="border"
		data-slug={slug}
		onpointerdown={() => {
			onSelect({ name, slug, icon })
		}}>
		<svg><use xlink:href="#{icon}"></use></svg>
		<figcaption class="truncate text-xs">{name}</figcaption>
	</figure>
{/snippet}
