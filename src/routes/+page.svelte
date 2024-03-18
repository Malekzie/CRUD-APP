<script lang="ts">
	import CreatePostDialog from "$lib/components/create-post-dialog.svelte";
	import PostCard from "$lib/components/post-card.svelte";

	let { data } = $props();
</script>

<div class="container max-w-xl">
	{#if data.session}
		<CreatePostDialog form={data.createPostForm} />
	{:else}
		<p>
			You need to be logged in to create a post <a href="/login" class="underline">Login now</a>
		</p>
	{/if}
	<div class="flex flex-col gap-2">
		{#each data.posts as post (post.id)}
			<PostCard {post} form={data.deletePostForm} />
		{/each}
	</div>
</div>
