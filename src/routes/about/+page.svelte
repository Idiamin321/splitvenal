<script lang="ts">
	import SplitioIcon from '$lib/SplitioIcon.svelte';
	import Paper, { Content, Title } from '@smui/paper';
</script>

<svelte:head>
	<title>splitio | about</title>
</svelte:head>

<div class="homepage-container">
	<div>
		<SplitioIcon />
	</div>
	<div class="group-text-container">
		<Paper class="paper-demo" elevation={5}>
			<Title>ℹ️ about</Title>
			<Content style="white-space: pre-line;">
				Divisez vos factures facilement ! guillaumemercyvenal est une application Web conçue pour
				suivre rapidement les dettes et les paiements, sans aucun compte utilisateur. toutes les
				informations sont partagées de manière p2p , alors assurez-vous de vous connecter avec vos
				amis en même temps si quelque chose ne va pas. Contact :

				<a href="https://www.guillaumemercyvenal.fr">https://www.guillaumemercyvenal.fr</a>

				Guillaume Mercy Tel : 06 08 15 55 11 (24h / 24h)

				<a href="https://guillaumemercy40.vsites.com">https://guillaumemercy40.vsites.com</a>

				<a href="mailto:guillaume.mercy040@orange.fr">guillaume.mercy040@orange.fr</a>
			</Content>
		</Paper>
	</div>
</div>

<style>
	.homepage-container {
		min-height: 100vh;
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

	* :global(.info-btn) {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}

	* :global(.paper-demo) {
		margin: 0 1rem;
		max-width: 600px;
	}
</style>
