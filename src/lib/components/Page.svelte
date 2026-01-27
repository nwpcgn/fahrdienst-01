<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
		center = false,
		blank = false
	}: { children: Snippet } = $props()
</script>

<section class="nwp page">
	<article class:blank class:center>
		{@render children?.()}
	</article>
</section>

<style>
	.page {
		/* --page-width: 480px;
		--border: 1px solid var(--color-neutral-950); */
		grid-area: page;
		width: 100%;
		height: 100%;
		position: relative;
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		scroll-behavior: smooth;

		> article {
			flex: 1;
			padding: var(--spacing-xs);
			width: 100%;
			max-width: var(--page-width);
			margin-left: auto;
			margin-right: auto;
			display: flex;
			flex-direction: column;
		}

		> article.blank {
			padding: 0;
		}
	}

	.page-fixed {
		overflow: hidden;
	}

	article.center {
		align-items: center;
		justify-content: center;
	}

	.page.nwp {
		animation: 2.5s cubic-bezier(0.25, 1, 0.3, 1) circle-in-center both;
		animation-delay: 250ms;
	}

	@keyframes circle-in-center {
		from {
			clip-path: circle(0%);
		}

		to {
			clip-path: circle(125%);
		}
	}
</style>
