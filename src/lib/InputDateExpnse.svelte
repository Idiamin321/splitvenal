<script lang="ts">
	import type { FloatingLabelComponentDev } from '@smui/floating-label';
	import type { NotchedOutlineComponentDev } from '@smui/notched-outline';
	import NotchedOutline from '@smui/notched-outline';
	import type { InputComponentDev } from '@smui/textfield';
	import Textfield, { Input } from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Icon from '@smui/textfield/icon';

	let self: HTMLElement;
	export let value = '';
	let input: InputComponentDev;
	let notchedOutline: NotchedOutlineComponentDev;
	let floatingLabel: FloatingLabelComponentDev;

	const openCalendar = () => {
		const myInput = self.querySelector('#input-manual') as HTMLInputElement;
		if ('showPicker' in HTMLInputElement.prototype) {
			// showPicker() is supported.
			myInput.showPicker();
		}
	};
</script>

<div bind:this={self}>
	<Textfield
		style="width:100%"
		bind:input
		bind:notchedOutline
		bind:floatingLabel
		variant="outlined"
	>
		<NotchedOutline bind:this={notchedOutline} slot="label" />
		<Icon class="material-icons" slot="leadingIcon">event</Icon>

		<Input
			type="date"
			bind:this={input}
			bind:value
			id="input-manual"
			on:focus={() => openCalendar()}
			aria-controls="helper-text-manual"
			aria-describedby="helper-text-manual"
		/>
		<HelperText id="helper-text-manual" slot="helper">Helper Text</HelperText>
	</Textfield>
</div>

<style>
	:global(.mdc-text-field.mdc-text-field--outlined i) {
		width: 48px;
		padding: 12px;
		align-self: center;
	}
</style>
