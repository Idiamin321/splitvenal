<script lang="ts">
	import { Item, Meta, Text } from '@smui/list';
	import Paper, { Content, Title } from '@smui/paper';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import {
		deleteGroupFromLocalStorage,
		getRecentGroups,
		startSyncInBackground
	} from './_modules/recentGroupsStorage';
	import { redirectToGroup } from './_modules/utils';
	export let user: any;
	let recentGroups: object[] = [];
	onMount(async () => {
		await startSyncInBackground();
		recentGroups = getRecentGroups();
	});
	let updateGroups = async (nodeid: string, onCompletion?: Function) => {
		await deleteGroupFromLocalStorage(nodeid);
		recentGroups = getRecentGroups();
	};
</script>

{#if recentGroups.length !== 0}
	<div in:slide={{ delay: 0, duration: 600 }}>
		<Paper elevation={5} class="recent-paper">
			<Title>🕐 recent groups</Title>
			<Content>
				{#each recentGroups as item}
					<Item class="rounded-item">
						<Text on:click={() => redirectToGroup(item.groupId, item.secretKey)}>
							{item.groupName}
							<p class="footer">- id: {item.groupId}</p>
						</Text>
						{#if user}
							<Meta on:click={() => updateGroups(item.groupId)} class="material-icons">delete</Meta>
						{:else}
							<Meta class="material-icons">arrow_forward</Meta>
						{/if}
					</Item>
				{/each}
			</Content>
		</Paper>
	</div>
{:else}
	<div />
{/if}

<style>
	* :global(.recent-paper) {
		margin: 0.5rem 0rem;
		min-width: 250px;
		max-width: 300px;
	}

	.footer {
		/* text-align: center; */
		display: inline;
		color: grey;
		/* height: 33px; */
	}
</style>
