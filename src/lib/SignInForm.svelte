<script>
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';

	import { createEventDispatcher } from 'svelte';
	import { redirectToHome } from './_modules/utils';

	let email = '';
	let password = '';

	const dispatch = createEventDispatcher();

	function submit() {
		dispatch('submit', {
			email,
			password
		});
	}
</script>

<form on:submit|preventDefault={submit} class="rows margins {$$props.class}">
	<Textfield label="Email" id="email" name="email" type="email" bind:value={email} required />
	<Textfield label="Password" id="password" name="password" type="password" bind:value={password} />

	<Button
		on:click={() => redirectToHome()}
		style="border-radius: 17px; margin: 1rem"
		variant="raised"
		color="secondary"
		type="submit">Sign In</Button
	>
</form>
