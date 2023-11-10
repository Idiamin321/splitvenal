<script lang="ts">
	import Button from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import Textfield from '@smui/textfield';
	export let openDialog = false;
	export let editCallback: Function = () => {};
	export let deleteCallback: Function = () => {};

	export let memberName: string = '';
	let editMemberValue = '';
	let isEditMode = false;
	let isSaving = false;
	$: editMemberValue = memberName;

	const deleteMembers = () => {
		isSaving = true;
		// Call the editCallback with the new name
		deleteCallback();
		isEditMode = false;
		isSaving = false;
	};

	const submitMembers = () => {
		isSaving = true;
		// Call the editCallback with the new name
		editCallback(editMemberValue);
		isEditMode = false;
		isSaving = false;
	};
</script>

<Dialog
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Title id="default-focus-title">🖊️ Edit Member</Title>
	<Content id="default-focus-content">
		<div>
			Enter their name:
			<Textfield bind:value={editMemberValue} />
		</div>
		<p>⚠️ You can edit the member name and click "Save" to update.</p>
	</Content>
	<Actions>
		<Button variant="outlined" on:click={deleteMembers}>delete</Button>
		<Button on:click={() => (isEditMode = false)}>cancel</Button>
		<Button variant="unelevated" disabled={isSaving} on:click={submitMembers}>save</Button>
	</Actions>
</Dialog>
