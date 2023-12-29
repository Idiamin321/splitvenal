<script lang="ts">
	import Button, { Label } from '@smui/button';
	import Dialog, { Actions, Content, InitialFocus, Title } from '@smui/dialog';
	import List, { Graphic, Item, PrimaryText, SecondaryText, Text } from '@smui/list';
	import { recordPayment } from './_modules/money';
	import { absRounded, getMemberAvatarURL } from './_modules/utils';

	export let openDialog = false;
	export let payerName: string = '';
	export let receiverName: string = '';
	export let debtAmount: number = 0.0;
	$: absAmount = Math.abs(debtAmount);
	$: roundedDebt = +absRounded(debtAmount);
</script>

<Dialog
	bind:open={openDialog}
	slot="over"
	aria-labelledby="over-fullscreen-confirmation-title"
	aria-describedby="over-fullscreen-confirmation-content"
>
	<Title id="over-focus-title">💰 record payment</Title>
	<Content id="over-focus-content">
		<List twoLine avatarList>
			<Item>
				<Graphic style="background-image: url({getMemberAvatarURL(payerName)});" />
				<Text>
					<PrimaryText>
						{payerName} <span style="color: gray">pays to</span>
						{receiverName}
					</PrimaryText>
					<SecondaryText class="success-text">${roundedDebt}</SecondaryText>
				</Text>
				<Graphic
					style="margin-left: auto;
					margin-right: 0;
					background-image: url({getMemberAvatarURL(receiverName)});"
				/>
			</Item>
		</List>
		<p>this will record a payment of €{roundedDebt} in the group</p>
	</Content>
	<Actions>
		<Button use={[InitialFocus]}>
			<Label>cancel</Label>
		</Button>
		<Button
			variant="unelevated"
			disabled={payerName === '' || receiverName === '' || roundedDebt === 0.0}
			on:click={() => recordPayment(payerName, receiverName, absAmount)}
		>
			<Label>save</Label>
		</Button>
	</Actions>
</Dialog>
