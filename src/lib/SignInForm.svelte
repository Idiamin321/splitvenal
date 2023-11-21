<script>
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';

	import { createEventDispatcher } from 'svelte';

	let email = '';
	let password = '';

	const dispatch = createEventDispatcher();
</script>

<form method="POST" action="?/login" class="rows margins {$$props.class}">
	<Textfield label="Email" id="email" input$name="email" type="email" bind:value={email} required />
	<Textfield
		label="Password"
		id="password"
		input$name="password"
		type="password"
		bind:value={password}
	/>

	<Button style="border-radius: 17px; margin: 1rem" variant="raised" color="secondary" type="submit"
		>Sign In</Button
	>
</form>
