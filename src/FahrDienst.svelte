<script lang="ts">
	import { rhId } from './lib'
	import FahrDetails from './lib/fahrerDetailsPage.svelte'
	import FahrHeader from './lib/fahrerHeaderPage.svelte'
</script>

{#if !$rhId}
	<FahrHeader></FahrHeader>
{:else}
	<FahrDetails></FahrDetails>
{/if}
