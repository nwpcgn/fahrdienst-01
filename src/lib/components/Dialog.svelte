<script>
	import Portal from './util/Portal.svelte'
	let {
		showModal = $bindable(),
		children,
		footer,
		header,
		autoClose
	} = $props()
	let dialog = $state() // HTMLDialogElement

	const handleCloseAction = () => {
		showModal = false
	}

	$effect(() => {
		if (showModal) dialog.showModal()
		if (!showModal) handleCloseAction()
	})
</script>

{#if showModal}
	<Portal target="#portals" bodyClass="modal-active">
		<dialog class="modal" bind:this={dialog} onclose={handleCloseAction}>
			<div class="modal-box">
				{@render header?.()}
				{@render children?.()}
				{@render footer?.()}
			</div>
			{#if autoClose}
				<form method="dialog" class="modal-backdrop">
					<button value="CLOSE">close</button>
				</form>
			{/if}
		</dialog>
	</Portal>
{/if}
