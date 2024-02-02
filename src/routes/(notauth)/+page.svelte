<script lang="ts">
	export let form;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="h-screen w-screen flex items-center justify-center">
	<div class="shadow-sm p-4 rounded-sm">
		{#if form?.askOTP}
			<h1 class="text-3xl">Valide OTP</h1>
			<form
				class="flex flex-col gap-4 mt-4"
				method="POST"
				action="?/validateOTP"
			>
				<input
					name="username"
					type="text"
					value={form?.username}
					placeholder="Username"
					hidden
					readonly
				/>
				<input
					name="identifier"
					type="text"
					value={form?.identifier}
					hidden
					readonly
				/>
				<input name="otp" type="number" placeholder="OTP" />
				<button type="submit">Validate</button>
			</form>
		{:else}
			<h1 class="text-3xl">Login</h1>
			<form class="flex flex-col gap-4 mt-4" method="POST" action="?/login">
				{#if form?.success === false}
					<p class="bg-red-500 text-white rounded-sm px-2 py-1">
						{form?.message}
					</p>
				{/if}
				<input name="username" type="text" placeholder="Username" />
				<input name="password" type="password" placeholder="Password" />
				<input type="submit" value="Login" />
			</form>
		{/if}
	</div>
</div>
