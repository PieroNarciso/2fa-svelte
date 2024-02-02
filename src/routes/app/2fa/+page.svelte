<script lang="ts">
	import qrcode from 'qrcode';
	import { onMount } from 'svelte';

	export let data;
	export let form;

	let qrcodeUrl = '';

	onMount(async () => {
		qrcodeUrl = await qrcode.toDataURL(data.url!);
	});
</script>

<div>
	<h1>2fa</h1>
	{form?.message}
	<div>
		<img src={qrcodeUrl} alt="qrcode" />
	</div>
	<div>
		<p>Setup 2fa</p>
		<form method="POST" action="/app/2fa">
			<input type="number" name="code" placeholder="OTP Code" />
			>
			<button type="submit">Activate</button>
		</form>
	</div>
</div>
