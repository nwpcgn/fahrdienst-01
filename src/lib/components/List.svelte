<script lang="ts">
	import { app } from '../app.svelte.ts'
	import ListItem from './ListItem.svelte'
	import Dialog from './Dialog.svelte'
	let { changeView } = $props()
	let dialogContent = $state({
		snippet: ListItem,
		props: {
			slug: 'map',
			name: 'Map',
			icon: 'fd-map'
		}
	})
	let showModal = $state(false)
	let listId = $state(0)
</script>

{#if app?.tourList}
	<ul class="list bg-base-100 shadow-sm">
		{#each app.tourList as line, id (id)}
			<ListItem {...line} {id} bind:listId></ListItem>
		{/each}
	</ul>
{/if}
