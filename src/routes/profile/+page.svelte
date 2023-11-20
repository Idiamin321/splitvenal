<script>
	import { enhance } from '$app/forms';
	import { redirectToAbout, redirectToGroup } from '$lib/_modules/utils';
	import Button, { Icon, Label } from '@smui/button';
	import IconButton from '@smui/icon-button';
	import { onMount } from 'svelte';
	let secret;
	onMount(async () => {
		secret = window.location.hash;
	});
	let error;
	export let data;
	const authorizedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

	const { user, gId } = data;
</script>

<div class="container">
	<!-- Fixed the class name here -->
	<div class="group-text-container">
		<div class="mdc-typography--body1 head-nav">
			<h1 style="line-height: 35px; letter-spacing: 4;">Change Profile Picture</h1>
			<Button color="secondary" on:click={() => redirectToGroup(gId, secret)}>
				<Icon class="material-icons">arrow_back</Icon>
				<Label>Back</Label>
			</Button>
		</div>
		{#if user.profilePic}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				src={user.profilePic}
				alt="Profile Picture"
				class="profile-pic"
				style="width: 250px; height: auto; margin-bottom: 15px;"
			/>
		{:else}
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" height="200" viewBox="0 -960 960 960" width="200"
					><path
						d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
					/></svg
				>
			</div>
		{/if}

		<form method="post" use:enhance action="?/upload">
			<div class="group">
				<span
					class="mdc-button mdc-button--raised smui-button--color-primary mdc-ripple-upgraded btn btn-file"
				>
					<i class="material-icons" style="margin-right: 15px;">cloud_upload</i>
					Browse<input
						style="filter: alpha(opacity=0);"
						type="file"
						id="file-upload"
						name="file-upload"
						accept={authorizedExtensions.join(',')}
						required
					/>
				</span>
				<input
					bind:value={user.id}
					placeholder="Group ID"
					id="user-id"
					name="user-id"
					class="solo-input"
					style="display:none;"
				/>
			</div>

			<Button
				style="border-radius: 17px; margin: 1rem"
				variant="raised"
				color="secondary"
				type="submit">Upload</Button
			>
		</form>
	</div>

	<IconButton
		on:click={() => redirectToAbout()}
		class="material-icons info-btn"
		aria-label="Information">info</IconButton
	>
</div>

<style>
	h1 {
		font-family: roboto, sans;
	}
	.container {
		/* Fixed the class name here */
		min-height: 80vh;
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

	.btn-file {
		position: relative;
		overflow: hidden;
	}
	.btn-file input[type='file'] {
		position: absolute;
		top: 0;
		right: 0;
		min-width: 100%;
		min-height: 100%;
		font-size: 100px;
		text-align: right;
		opacity: 0;
		outline: none;
		background: white;
		cursor: inherit;
		display: block;
	}

	.head-nav {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		gap: 32px;
	}
	@media screen and (max-width: 600px) {
		.head-nav {
			flex-direction: column-reverse; /* Mengubah arah flex menjadi kolom */
			align-items: center; /* Pusatkan item di tengah */
			text-align: center; /* Pusatkan teks */
			gap: 0;
		}
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
		width: 100%;
		height: 100px;
	}
</style>
