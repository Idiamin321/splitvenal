<script lang="ts">
	import SplitioIcon from '$lib/SplitioIcon.svelte';
	import { getRecentGroups, startSyncInBackground } from '$lib/_modules/recentGroupsStorage.js';
	import { redirectToProfile } from '$lib/_modules/utils.js';
	import IconButton from '@smui/icon-button';
	import TopAppBar, { AutoAdjust, Row, Section } from '@smui/top-app-bar';
	import { onMount } from 'svelte';

	let recentGroups: object[] = [];
	onMount(() => {
		startSyncInBackground();
		recentGroups = getRecentGroups();
	});
	let topAppBar;
	export let data;
	export let groupId = data.props.groupId;
	let lightTheme =
		typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
	function switchTheme() {
		lightTheme = !lightTheme;
		let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
		if (!themeLink) {
			themeLink = document.createElement('link');
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
		document.head
			.querySelector<HTMLLinkElement>('link[href="/smui-dark.css"]')
			?.insertAdjacentElement('afterend', themeLink);
	}

	const hanldletoProfile = (id, gourps) => {
		const group = gourps.find((item) => item.groupId === id);
		if (group) redirectToProfile(id, group.secretKey);
	};
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<SplitioIcon isTopApp />
		</Section>
		<Section align="end">
			<IconButton
				on:click={() => hanldletoProfile(groupId, recentGroups)}
				class="material-icons user-btn"
				aria-label="person">person</IconButton
			>
			<IconButton on:click={switchTheme} class="material-icons" aria-label="Information"
				>{lightTheme ? 'light_mode' : 'dark_mode'}</IconButton
			>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
	<div class="container">
		<slot />
	</div>
	<div class="mdc-typography--caption footer">Abdoul Gmercy</div>
</AutoAdjust>

<style>
	.footer {
		text-align: center;
		color: grey;
		height: 33px;
	}
</style>
