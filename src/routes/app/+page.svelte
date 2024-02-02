<script lang="ts">
	export let data;
</script>

<div>
	<h1>App</h1>

	<form method="POST" action="/app?/logout">
		<button type="submit">Logout</button>
	</form>

	{#if data.twofa_enabled}
		<a href="/app/2fa">2fa</a>
	{/if}
</div>
