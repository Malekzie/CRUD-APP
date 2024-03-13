<script>
	import { Button } from '$lib/components/ui/button';
	import '../app.pcss';
	import { page } from '$app/stores';

	let { data } = $props();

	$page;
</script>

<div class="flex items-center w-full h-16 border-b">
	<div class="container flex items-center justify-between">
		<div>
			<a href="/">Purple</a>
		</div>
			<div class="flex items-center justify-between">
				{#if !data.session}
				<div class="flex items-center max-w-xl gap-4">
					<Button href="/login" variant={$page.url.pathname.includes('login') ? 'outline' : 'ghost'}
					>Login</Button
					>
					<Button
					href="/register"
					variant={$page.url.pathname.includes('register') ? 'outline' : 'ghost'}>Register</Button
					>
				</div>
					{:else}
				<form action="/logout" method="POST">
					<Button type="submit">Logout</Button>
				</form>
				{/if}
		</div>
	</div>
</div>
<slot />
