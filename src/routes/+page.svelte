<script lang="ts">
	import CreateGroupDialog from '$lib/CreateGroupDialog.svelte';
	import LoadingSpinnerOverlay from '$lib/LoadingSpinnerOverlay.svelte';
	import RecentGroupsList from '$lib/RecentGroupsList.svelte';
	import SplitioIcon from '$lib/SplitioIcon.svelte';
	import { getSEA, initAppDB } from '$lib/_modules/initGun';
	import { putSecure } from '$lib/_modules/secure';
	import { redirectToAbout, redirectToGroup, redirectToLogin } from '$lib/_modules/utils';
	import { postGroupToServer } from '$lib/api/groups/postGroups';
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/common';
	import IconButton from '@smui/icon-button';
	import SvelteSeo from 'svelte-seo';

	export let data;

	export let user = data.props.user;

	let groupValue = '';
	let openCreateGroupDialog: boolean = false;
	let showLoadingSpinner: boolean = false;

	function handleKeyDown(event: CustomEvent | KeyboardEvent) {
		event = event as KeyboardEvent;
		if (event.key === 'Enter') {
			redirectToGroup(groupValue, window.location.hash);
		}
	}

	let appDB: any = undefined;
	let SEA: any | undefined = undefined;

	const initGunIfNew = () => {
		if (!appDB) appDB = initAppDB();
		if (!SEA) SEA = getSEA();
	};

	const createGroup = async (groupName: string) => {
		showLoadingSpinner = true;
		const pair = await SEA.pair();
		const result = appDB.set({ expenses: {}, members: {}, groupInfo: {}, pubKey: pair?.pub });
		const secretKey = '#' + pair.priv;
		const nodeid = result._.has;
		let infoNode = appDB.get(nodeid).get('groupInfo');

		try {
			await postGroupToServer(nodeid, secretKey, groupName);
		} catch (error) {
			console.error('Error saving group to database:', error);
			// Handle error saving to the database, if needed
		}

		putSecure(infoNode, { name: groupName }, secretKey, (ack) => {
			if (!ack.err) {
				redirectToGroup(nodeid, secretKey);
			} else {
				alert('error creating group :( please try again. code: ' + ack.err);
				showLoadingSpinner = false;
			}
		});
	};
</script>

<SvelteSeo
	title="splitio | home"
	description="split your bills easily! splitio is an open-source webapp built for tracking debts and payments quickly, without any user accounts."
	openGraph={{
		title: 'splitio | split your bills easily!',
		description:
			'splitio is an open-source webapp built for tracking debts and payments quickly, without any user accounts.',
		url: 'https://github.com/cryptoboid/splitio',
		type: 'website',
		images: [
			{
				url: 'https://raw.githubusercontent.com/cryptoboid/splitio/main/static/splitio_banner.png',
				width: 1280,
				height: 640,
				alt: 'splitio promotion banner'
			}
		]
	}}
/>

<div class="homepage-container">
	<a href="https://guillaumemercyvenal.fr">https://guillaumemercyvenal.fr</a><br /><br />

	<div class="row" style="display: flex; gap:12px;">
		<img
			src="https://bon-petit.mum-multi-service.ml/5791684-0-image-a-9_1541430168322.jpg"
			width="612"
			height="408"
			class="center"
		/>

		<img
			src="https://bon-petit.mum-multi-service.ml/gettyimages-151909989-612x612.jpg"
			width="612"
			height="408"
			class="center"
		/>
	</div>
	<br /><br />

	<h1 style="font-weight:bold;">Créer Un Groupe</h1>
	<br /><br />

	<p style="font-size:22px;">
		Vous pouvez créer ou rejoindre un groupe dans le but de partager vos dépenses avec vos
		amis/famille/collègue.
	</p>
	<br /><br />

	<h1 style="font-weight:bold;">Ajouter Une Personne</h1>
	<br /><br />

	<p style="font-size:22px;">
		Dans le groupe créé, vous pouvez ajouter n nombre de membres avec lesquels vous partagez vos
		factures/coûts.
	</p>

	<h1 style="font-weight:bold;">Ajouter Une Dépense</h1>
	<br /><br />

	<p style="font-size:22px;">
		Tout membre du groupe peut ajouter ses dépenses individuelles effectuées et il peut également
		ajouter avec qui il les a partagées.
	</p>
	<br /><br />

	<h1 style="font-weight:bold;">Coût Partagé</h1>
	<br /><br />

	<p style="font-size:22px;">
		Enfin, vos coûts sont répartis entre vos membres ajoutés avec un calcul précis et chaque membre
		peut savoir combien d'argent il doit se payer.
	</p>
	<br /><br />

	<div class="ow" style="display: flex; gap:12px;">
		<img
			src="https://bon-petit.mum-multi-service.ml/sex-and-the-city-serie-1024x685.jpg"
			width="612"
			height="408"
			class="center"
		/><br /><br />

		<img
			src="https://bon-petit.mum-multi-service.ml/2db4ae90-11ff-11ea-b64f-0ea54698a1a8.jpg"
			width="612"
			height="408"
			class="center"
		/>
	</div>
	<br /><br />

	<SplitioIcon />
	<div class="group-text-container">
		<RecentGroupsList {user} />
		<Button
			style="border-radius: 17px; margin: 1rem"
			variant="raised"
			color="secondary"
			on:click={() => {
				openCreateGroupDialog = true;
				initGunIfNew();
			}}
		>
			<Icon class="material-icons">add</Icon>
			<Label>create groupe</Label>
		</Button>
		<!-- <div class="mdc-typography--body1">or paste your group id here:</div>
		<Paper class="solo-paper" elevation={5}>
			<Icon class="material-icons">group</Icon>
			<Input
				bind:value={groupValue}
				on:keydown={handleKeyDown}
				placeholder="Group ID"
				class="solo-input"
			/>
			<Fab
				on:click={() => redirectToGroup(groupValue, window.location.hash)}
				exited={groupValue === ''}
				color="secondary"
				class="solo-fab"
			>
				<Icon class="material-icons">arrow_forward</Icon>
			</Fab>
		</Paper> -->
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

<LoadingSpinnerOverlay showOverlay={showLoadingSpinner} />

<CreateGroupDialog bind:openDialog={openCreateGroupDialog} addCallback={createGroup} />

<style>
	.homepage-container {
		min-height: calc(100vh - 2rem);
		padding-top: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 500px) {
		.homepage-container {
			padding-top: 5rem;
			min-height: calc(100vh - 5rem);
		}
	}

	.group-text-container {
		/* padding: 0px 1px; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 1.5rem;
	}

	* :global(.solo-paper) {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 1rem 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.solo-paper > *) {
		display: inline-block;
		margin: 0 12px;
	}
	* :global(.solo-input) {
		flex-grow: 1;
		color: var(--mdc-theme-on-surface, gray);
	}
	* :global(.solo-input::placeholder) {
		color: var(--mdc-theme-on-surface, gray);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
		height: 60px;
		width: 60px;
		/* margin-top: 0rem; */
	}

	* :global(.info-btn) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	* :global(.user-btn) {
		position: absolute;
		top: 1rem;
		right: 4rem;
	}
</style>
