<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { Graphic } from '@smui/list';
	import Select, { Option } from '@smui/select';
	import Icon from '@smui/select/icon';
	import Textfield from '@smui/textfield';
	import InputDateExpnse from './InputDateExpnse.svelte';
	import { getMemberAvatarURL } from './_modules/utils';

	export let openDialog = false;
	export let addCallback: Function = () => {};
	export let membersList: Array<Array<string | object>> = [];

	let dateExpense = '';
	let inputName: string = '';
	let inputAmount: number = 0.0;
	let inputPaidBy: string = '';
	let inputPaidFor: string = '';
</script>

<Dialog
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Title id="default-focus-title">🧾 add expense</Title>
	<Content id="default-focus-content">
		<LayoutGrid>
			<Cell span={12}>
				enter a description:
				<Textfield bind:value={inputName} />
			</Cell>
			<Cell span={12}>
				enter the amount € :
				<Textfield type="number" bind:value={inputAmount} />
			</Cell>
			<Cell span={12}>
				Paid For :
				<Textfield bind:value={inputPaidFor} />
			</Cell>
			<Cell span={12}>
				Date paid :
				<InputDateExpnse bind:value={dateExpense} />
			</Cell>
			<Cell span={12}>
				who payed?
				<Select bind:value={inputPaidBy} class="add-expense-select">
					<Icon
						slot="leadingIcon"
						style="background-image: url({getMemberAvatarURL(inputPaidBy, 24)});"
					/>
					<Option value="" />
					{#each membersList as [key, member]}
						<Option value={member.name}>
							<Graphic
								style="background-image: url({getMemberAvatarURL(member.name, 24)});"
							/>{member.name}</Option
						>
					{/each}
				</Select>
			</Cell>
		</LayoutGrid>
	</Content>
	<Actions>
		<Button>
			<Label>cancel</Label>
		</Button>
		<Button
			variant="unelevated"
			disabled={inputName === '' ||
				inputAmount === 0.0 ||
				inputPaidBy === '' ||
				inputPaidFor === ''}
			on:click={() => {
				addCallback(inputName, inputAmount, inputPaidBy, inputPaidFor, dateExpense);
				inputName = '';
				inputAmount = 0.0;
				inputPaidFor = '';
				inputPaidBy = '';
				dateExpense = '';
			}}
		>
			<Label>add</Label>
		</Button>
	</Actions>
</Dialog>
