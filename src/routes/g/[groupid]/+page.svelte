<script lang="ts">
	import AddExpenseDialog from '$lib/AddExpenseDialog.svelte';
	import AddMemberDialog from '$lib/AddMemberDialog.svelte';
	import EditMemberDialog from '$lib/EditMemberDialog.svelte';
	import GroupNotFoundDialog from '$lib/GroupNotFoundDialog.svelte';
	import GroupNotesDialog from '$lib/GroupNotesDialog.svelte';
	import LoadingSpinnerOverlay from '$lib/LoadingSpinnerOverlay.svelte';
	import SyncIssuesDialog from '$lib/SyncIssuesDialog.svelte';
	import TransactionsList from '$lib/TransactionsList.svelte';
	import ViewBalancesDialog from '$lib/ViewBalancesDialog.svelte';
	import { PLACEHOLDER_GROUP_NAME } from '$lib/_modules/constants';
	import { initAppDB } from '$lib/_modules/initGun';
	import { storeRecentGroup } from '$lib/_modules/recentGroupsStorage';
	import { deleteSecure, onSecure, putSecure, setSecure } from '$lib/_modules/secure';
	import { groupDB, groupStore, resetGroupStore, secretKey } from '$lib/_modules/stores';
	import { GroupNodeStates } from '$lib/_modules/types';
	import { getMemberAvatarURL } from '$lib/_modules/utils';
	import Chip, { Text as ChipText, LeadingIcon, Set } from '@smui/chips';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import { Image } from '@smui/image-list';
	import List, { Graphic, Item, Meta, Text } from '@smui/list';
	import Snackbar, { Label } from '@smui/snackbar';
	import { onMount } from 'svelte';
	import SvelteSeo from 'svelte-seo';

	export const ssr = true;
	export const csr = true;

	// $session.user;
	export let data;
	export let groupId = data.props.groupId;
	export let user = data.props.user;
	let selectedMemberName = {};
	let openEditMemberDialog: boolean = false;
	let openAddMemberDialog: boolean = false;
	let openAddExpenseDialog: boolean = false;
	let openViewBalancesDialog: boolean = false;
	let openSyncIssuesDialog: boolean = false;
	let openGroupNotesDialog: boolean = false;
	let copiedLinkSnackbar;

	let groupNodeState = GroupNodeStates.Unknown;

	let chips = [
		{
			title: 'balances',
			icon: 'balance',
			onClick: () => (openViewBalancesDialog = true)
		},
		{
			title: 'group notes',
			icon: 'description',
			onClick: () => (openGroupNotesDialog = true)
		},
		{
			title: 'share group',
			icon: 'share',
			onClick: () => {
				if (navigator.share) {
					navigator
						.share({
							title: 'splitio',
							text: "Let's split bills with this group in splitio 💰",
							url: window.location.href
						})
						.then(() => console.log('Successful share'))
						.catch((error) => console.log('Error sharing', error));
				} else {
					navigator.clipboard.writeText(window.location.href).then(copiedLinkSnackbar.open);
				}
			}
		},
		{
			title: 'sync issues?',
			icon: 'sync_problem',
			onClick: () => (openSyncIssuesDialog = true)
		}
	];

	onMount(() => {
		resetGroupStore();
		const appDB = initAppDB();
		$secretKey = window.location.hash;
		const GROUPID = groupId || 'unknown group';
		$groupDB = appDB.get(GROUPID);
		// detect group not found
		$groupDB.once(
			(val) => {
				if (val === undefined) groupNodeState = GroupNodeStates.NotFound;
				else groupNodeState = GroupNodeStates.Found;
			},
			{ wait: 5000 }
		);

		onSecure(
			$groupDB.get('expenses').map(),
			$secretKey,
			(plain, key) => ($groupStore.expenses[key] = plain),
			(key) => {
				delete $groupStore.expenses[key];
				$groupStore.expenses = $groupStore.expenses;
			}
		);

		onSecure(
			$groupDB.get('members').map(),
			$secretKey,
			(plain, key) => {
				$groupStore.members[key] = plain;
			},
			(key) => {
				delete $groupStore.members[key];
				$groupStore.members = $groupStore.members;
			}
		);

		onSecure(
			$groupDB.get('groupInfo'),
			$secretKey,
			(plain, key) => {
				$groupStore.groupInfo.name = plain.name;
				storeRecentGroup(GROUPID, $secretKey, plain.name);
			},
			(key) => {
				delete $groupStore.groupInfo[key];
				$groupStore.groupInfo = $groupStore.groupInfo;
			}
		);

		onSecure(
			$groupDB.get('payments').map(),
			$secretKey,
			(plain, key) => ($groupStore.payments[key] = plain),
			(key) => {
				delete $groupStore.payments[key];
				$groupStore.payments = $groupStore.payments;
			}
		);

		onSecure(
			$groupDB.get('groupNotes'),
			$secretKey,
			(plain, key) => {
				$groupStore.groupNotes = plain;
			},
			(key) => {
				$groupStore.groupNotes = '';
			}
		);
	});

	const addExpense = async (
		expenseName: string,
		expenseAmount: number,
		memberName: string,
		expenseFor: string,
		date?: any
	) => {
		const members = $groupStore.members;

		// Check if at least one member has the specified name
		const memberExists = Object.values(members).some((member) => member.name === memberName);

		if (!memberExists) throw SyntaxError;
		setSecure(
			$groupDB.get('expenses'),
			{
				title: expenseName,
				amount: expenseAmount,
				paidBy: memberName,
				forWhat: expenseFor,
				timestamp: date !== '' ? date : Date.now()
			},
			$secretKey
		);
	};

	const addMember = (memberName: string) => {
		setSecure($groupDB.get('members'), { name: memberName }, $secretKey);
	};

	const editMember = (newName: string, onCompletion: Function) => {
		if (!selectedMemberName) return;

		let node = $groupDB.get('members').get(selectedMemberName.key);
		if (!newName) deleteSecure(node, onCompletion);
		else putSecure(node, { name: newName }, $secretKey, onCompletion);

		openEditMemberDialog = false;
	};

	const deleteMember = (onCompletion?: Function) => {
		let node = $groupDB.get('members').get(selectedMemberName.key);
		deleteSecure(node, onCompletion);
		openEditMemberDialog = false;
	};

	const openEditMemberDialogHandler = (key, memberName: string) => {
		selectedMemberName = memberName;
		selectedMemberName.key = key;
		openEditMemberDialog = true;
	};
	const putGroupNotes = (noteValue: string, onCompletion: Function) => {
		let node = $groupDB.get('groupNotes');
		if (!noteValue) deleteSecure(node, onCompletion);
		else putSecure(node, noteValue, $secretKey, onCompletion);
	};

	$: transactions = Object.entries({ ...$groupStore.expenses, ...$groupStore.payments }).sort(
		(a, b) => b[1].timestamp - a[1].timestamp
	);
	$: members = Object.entries($groupStore.members);
	let bgImage = '';
	if (user) {
		const url = user.profilePic;
		let imageurl = url.replace('upload/', 'upload/w_80,h_80,c_fill/');
		bgImage = imageurl;
	}
</script>

<SvelteSeo
	openGraph={{
		title: 'splitio | group',
		description:
			'split your bills easily! splitio is an open-source webapp built for tracking debts and payments quickly, without any user accounts.',
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

<svelte:head>
	<title>splitio | {$groupStore.groupInfo.name}</title>
</svelte:head>
<div class="headline">
	<div class="mdc-typography--headline5">
		{$groupStore.groupInfo.name}
	</div>
	{#if user}
		<Image
			tag="div"
			style="background-image: url('{bgImage}'); border-radius:10px; width:120px; height:120px; background-repeat: no-repeat; background-size: cover;"
		/>
	{:else}
		<Image
			tag="div"
			style="background-image: url('https://source.boringavatars.com/beam/40$splitneval?colors=4DAB8C,542638,8F244D,C9306B,E86F9E'); border-radius:10px; width:120px; height:120px; background-repeat: no-repeat; background-size: cover"
		/>
	{/if}
</div>
<Set
	{chips}
	style="overflow-x: auto; flex-wrap: nowrap; margin-left: -10px; margin-right: -10px"
	let:chip
>
	<Chip {chip} shouldRemoveOnTrailingIconClick={false} on:click={chip.onClick}>
		<LeadingIcon class="material-icons">{chip.icon}</LeadingIcon>
		<ChipText tabindex={0}>{chip.title}</ChipText>
	</Chip>
</Set>

<div class="mdc-typography--headline5">💸 group transactions</div>

<TransactionsList {transactions} />

<div class="mdc-typography--headline5">🤝 members</div>
<List oneLine avatarList style="margin-bottom: 70px;">
	{#each members as [key, member]}
		<Item class="rounded-item">
			<Graphic style="background-image: url({getMemberAvatarURL(member.name)});" />
			<Text>{member.name}</Text>
			{#if user}
				<Meta
					on:click={() => {
						openEditMemberDialogHandler(key, member);
					}}
					class="material-icons">info</Meta
				>
			{/if}
		</Item>
	{/each}
	<Item on:click={() => (openAddMemberDialog = true)} class="rounded-item">
		<Text>add someone</Text>
		<Meta class="material-icons">person_add</Meta>
	</Item>
</List>

<!-- floating action button -->
<div class="flexy">
	<div class="margins">
		<Fab style="border-radius: 17px;" on:click={() => (openAddExpenseDialog = true)}>
			<FabIcon class="material-icons">post_add</FabIcon>
		</Fab>
	</div>
</div>

<!-- loading overlay -->
<LoadingSpinnerOverlay showOverlay={$groupStore.groupInfo.name === PLACEHOLDER_GROUP_NAME} />

<GroupNotFoundDialog {groupNodeState} />

<!-- add member dialog -->
<EditMemberDialog
	bind:openDialog={openEditMemberDialog}
	editCallback={editMember}
	deleteCallback={deleteMember}
	memberName={selectedMemberName.name}
/>
<!-- add member dialog -->
<AddMemberDialog bind:openDialog={openAddMemberDialog} addCallback={addMember} />

<!-- add expense dialog -->
<AddExpenseDialog
	membersList={members}
	bind:openDialog={openAddExpenseDialog}
	addCallback={addExpense}
/>

<ViewBalancesDialog
	bind:openDialog={openViewBalancesDialog}
	expensesObj={$groupStore.expenses}
	paymentsObj={$groupStore.payments}
	membersList={members}
/>

<SyncIssuesDialog bind:openDialog={openSyncIssuesDialog} />

<GroupNotesDialog bind:openDialog={openGroupNotesDialog} putNotesCallback={putGroupNotes} />

<Snackbar bind:this={copiedLinkSnackbar}>
	<Label>📋 link copied to clipboard, now share it!</Label>
</Snackbar>

<style>
	.flexy {
		/* display: flex;
		flex-wrap: wrap;
		align-items: center; */
		position: fixed;
		bottom: 10px;
		right: 10px;
		z-index: 1;
	}

	.headline {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		max-height: 40px;
		width: 97vw;
	}

	@media screen and (max-width: 600px) {
		.headline {
			max-height: 120px;
		}
	}

	* :global(.margins) {
		margin: 0 0.4em 0.4em 0;
	}
</style>
