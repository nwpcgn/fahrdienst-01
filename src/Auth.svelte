<script lang="ts">
	import { fid } from './lib'
	import { userAnmelden } from './lib/fetchData'
	import type { Snippet } from 'svelte'
	let { children }: { children: Snippet } = $props()
	let username = $state('')
	let password = $state('')

	const handleSubmit = async (e) => {
		console.log(e)
		e.preventDefault()
		userAnmelden(username, password)
	}
</script>

{#if $fid}
	{@render children?.()}
{:else}
	<main class="main">
		<div class="page pattern-bg opacity-45"></div>
		<section class="nwp page center">
			<form onsubmit={handleSubmit}>
				<fieldset
					class="fieldset w-xs rounded-xl border-2 border-slate-300 bg-base-200 p-6">
					<legend
						class="fieldset-legend rounded-lg bg-base-200 px-2 py-1 text-lg font-bold"
						>Login</legend>

					<label class="label">Username</label>
					<input
						bind:value={username}
						type="text"
						class="input"
						placeholder="Username"
						required />

					<label class="label">Password</label>
					<input
						bind:value={password}
						type="password"
						class="input"
						placeholder="Password"
						required />

					<button type="submit" class="btn mt-4 btn-neutral">Login</button>
				</fieldset>
			</form>
		</section>
	</main>
{/if}
