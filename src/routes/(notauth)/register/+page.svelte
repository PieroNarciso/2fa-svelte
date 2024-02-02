<script lang="ts">
	let username = '';
	let password = '';
	let confirmPassword = '';


  export let form;
</script>

<div class="h-screen flex items-center justify-center">
	<div class="shadow-sm p-4 rounded-sm">
		<h1 class="text-3xl">Register</h1>
		<form class="flex flex-col gap-4 mt-4" method="POST">
      {#if form?.success === false}
        <p class="bg-red-500 text-white rounded-sm px-2 py-1">{form?.message}</p>
      {/if}
			<input name="username" type="text" value={username} placeholder="Username" />
			<input name="password" type="password" value={password} placeholder="Password" />
			<input
				name="confirmPassword"
				type="password"
				value={confirmPassword}
				placeholder="Confirm Password"
			/>
			<button type="submit">Register</button>
		</form>
	</div>
</div>
