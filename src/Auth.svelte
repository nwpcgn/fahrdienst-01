<script lang="ts">
	import CryptoJS from 'crypto-js'
	import { uid, fid, fahrer, fro } from './lib/storage.ts'
	const url5 = 'https://lab-quade.de/fahrdienst_app/tour_auth.php'
	let { children, role1, role2, role3 } = $props()
	let username = $state('')
	let password = $state('')

	const sendData = async () => {
		if (!username || !password) {
			alert('Zu wenig Input')
			return
		}
		const key = CryptoJS.MD5(password).toString()
		let uri = `${url5}?uid=${$uid}&user=${username}&pw=${key}`

		try {
			const req = await fetch(uri)
			const { error, data } = await req.json()
			if (data) {
				const id = data?.user_id
				console.log({ id })
				fahrer.set(username)
				fid.set(data?.user_id)
				fro.set(data?.user_rolle)
			}

			if (error) {
				throw new Error('Anmeldung nicht erfolgreich')
			}
		} catch (error) {
			console.log(error)
			alert(error)
		}
	}
</script>

{#if $fid}
	{@render children?.()}
{:else}
	<main class="main">
		<section class="nwp page center">
			<div>
				<fieldset
					class="fieldset w-xs rounded-box border border-base-300 bg-base-200 p-4">
					<legend class="fieldset-legend">Login</legend>

					<label class="label">Username</label>
					<input
						bind:value={username}
						type="text"
						class="input"
						placeholder="Username" />

					<label class="label">Password</label>
					<input
						bind:value={password}
						type="password"
						class="input"
						placeholder="Password" />

					<button class="btn mt-4 btn-neutral" onclick={sendData}>Login</button>
				</fieldset>
			</div>
		</section>
	</main>
{/if}
