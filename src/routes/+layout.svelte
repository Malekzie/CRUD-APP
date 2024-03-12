<script>
	import { Button } from '$lib/components/ui/button';
	import '../app.pcss';
	import { page } from '$app/stores';

	let { data } = $props();

	$page;
</script>

<div class="w-full max-w-xl mx-auto">
	<pre>User: {JSON.stringify(data.user, null, 2)}</pre>
	<div class="flex justify-between items center">
		<div class="flex items-center max-w-xl gap-4 pt-8">
			<Button href="/login" variant={$page.url.pathname.includes('login') ? 'outline' : 'ghost'}
				>Login</Button
			>
			<Button
				href="/register"
				variant={$page.url.pathname.includes('register') ? 'outline' : 'ghost'}>Register</Button
			>
		</div>
          <form action="/logout" method="POST">
               <Button type="submit">Logout</Button>
          </form>
	</div>
</div>
<slot />
