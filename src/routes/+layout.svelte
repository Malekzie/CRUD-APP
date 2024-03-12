<script>
	import '../app.pcss';

	let { data } = $props(); 
	
</script>

<div class="w-full max-w-xl mx-auto">
     
     <pre>User: {JSON.stringify(data.user, null, 2)}</pre>
     <pre>Session: {JSON.stringify(data.session, null, 2)}</pre>
</div>
<slot />
