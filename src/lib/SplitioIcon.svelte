<script lang="ts">
	import { Title as TopTitle } from '@smui/top-app-bar';
	import Ripple from '@smui/ripple';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	export let isTopApp = false;
</script>

{#if isTopApp}
	<div
		use:Ripple={{ surface: true }}
		tabindex="0"
		style="display: flex; flex-direction: row; align-items: center; border-radius: 17px;"
		on:click={() => goto('/')}
	>
		<img
			src={base + '/logo_black.png'}
			height="27px"
			alt="icon"
			style="margin-left: 10px"
			href="/"
		/>
		<TopTitle style="font-family: Josefin Sans;font-size: x-large;margin-left: -13px;">
			Guillaume Mercy Venal
		</TopTitle>
	</div>
{:else}
	<div
		use:Ripple={{ surface: true }}
		on:click={() => goto('/')}
		style="align-items: center; display: flex; flex-direction: column; border-radius: 17px;"
	>
		<img src={base + '/logo_black.png'} height="70rem" style="margin-bottom: 10px;" alt="icon" />
		<div class="logo-home">Guillaume Mercy Venal</div>
	</div>
{/if}

<style>
	.logo-home {
		font-family: Josefin Sans;
		font-size: 3rem;
		/* margin-bottom: 1.5rem; */
	}

	[tabindex='0'] {
		cursor: pointer;
	}
</style>
