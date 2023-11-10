<script>
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import SignInForm from '$lib/SignInForm.svelte';
	import { redirectToAbout, redirectToLogin } from '$lib/_modules/utils';
	import IconButton from '@smui/icon-button/IconButton.svelte';
	/**
	 * @type {any}
	 */
	let error;

	async function handleSubmit({ detail: { email, password } }) {
		const response = await fetch('/api/sign-in', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const body = await response.json();
		if (response.ok) {
			// session from getSession hook will otherwise not be set before navigation
			// that would trigger redirect from /protected back to /sign-in
			$session = body;
			await goto('/');
		}
		error = body.message;
	}
</script>

<div class="homepage-container">
	<div class="group-text-container">
		<h1 class="text-2xl font-semibold text-center">Sign In</h1>
		{#if error}
			<p class="mt-3 text-red-500 text-center font-semibold">{error}</p>
		{/if}
		<SignInForm class="max-w-xl mx-auto mt-8" on:submit={handleSubmit} />
	</div>
	<IconButton on:click={() => redirectToLogin()} class="material-icons user-btn" aria-label="person"
		>person</IconButton
	>
	<IconButton
		on:click={() => redirectToAbout()}
		class="material-icons info-btn"
		aria-label="Information">info</IconButton
	>
</div>

<style>
	.homepage-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.group-text-container {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	* :global(.info-btn) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	* :global(.paper-demo) {
		margin: 0 1rem;
		max-width: 600px;
	}

	* :global(.user-btn) {
		position: absolute;
		top: 1rem;
		right: 4rem;
	}
</style>
