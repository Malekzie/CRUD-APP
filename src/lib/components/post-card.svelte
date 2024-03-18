<script lang="ts">
     import UpdatePostPage from '../../routes/posts/[id]/update/+page.svelte';
	import * as Card from "$lib/components/ui/card";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import type { PostWithUser } from "$lib/server/schemas";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { EllipsisVertical, Trash2, SquarePen, Square } from "lucide-svelte";
	import { buttonVariants } from "./ui/button";
	import SuperDebug, { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { deletePostSchema } from "$lib/zod-schema";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { sleep } from "$lib/utils.js";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";
	import { goto, preloadData, pushState } from '$app/navigation';

	type Props = {
		form: SuperValidated<Infer<typeof deletePostSchema>>;
		post: PostWithUser;
	};
	let { post, form: theForm } = $props<Props>();

	const form = superForm(theForm, {
		validators: zodClient(deletePostSchema),
		onUpdated: ({ form: returnForm }) => {
			if (!returnForm.valid) return toast.error("Error deleting your post!");

			openStates.deleteDialogOpen = false;

			toast.success("Post deleted successfully!");
		},
	});

	const { enhance } = form;

	const openStates = $state({
		deleteDialogOpen: false,
		dropdownOpen: false,
		editDialogOpen: false,
	});



	async function handleEditLinkClick(event: MouseEvent) {
		// @ts-expect-error
		const e = event.detail.originalEvent as MouseEvent;


		if (e.ctrlKey || e.metaKey) return;
		const currentTarget = e.currentTarget;


		if (!(currentTarget instanceof HTMLAnchorElement)) return;
		e.preventDefault();

		
		const { href } = currentTarget;
		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, {
				updatePost: {
					data: {
						updatePostForm: result.data.updatePostForm,
						postId: result.data.postId,
					},
					dialog: true,
				}
			})
		} else {
			goto(href);
		}
	}

	$page;
</script>

<Card.Root>
	<Card.Header class="flex-row items-center justify-between">
		<Card.Title>
			{post.title}
		</Card.Title>
		{#if $page.data.user && $page.data.user.id === post.userId}
			<DropdownMenu.Root bind:open={openStates.dropdownOpen}>
				<DropdownMenu.Trigger class={buttonVariants({ size: "icon", variant: "ghost" })}>
					<EllipsisVertical class="size-4" />
					<span class="sr-only">Post options</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item href="/posts/{post.id}/update" on:click={handleEditLinkClick}>
						<SquarePen class="mr-2 size-4" />
						Edit
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onclick={(e) => {
							e.preventDefault();
							openStates.dropdownOpen = false;
							sleep(2).then(() => {
								openStates.deleteDialogOpen = true;
							});
						}}
					>
						<Trash2 class="mr-2 size-4" />
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</Card.Header>
	<Card.Content>
		{post.content}
	</Card.Content>
	<Card.Footer>
		{post.user.username}
	</Card.Footer>
</Card.Root>
<SuperDebug data={$page.state}/>

{#if $page.state.updatePost?.dialog && $page.state.updatePost.data.postId === post.id}
{@const data = {
	...$page.state.updatePost.data,
	user: $page.data.user,
	session: $page.data.session
}}
	<UpdatePostPage {data} dialog={$page.state.updatePost.dialog}/>
{/if}

<AlertDialog.Root bind:open={openStates.deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Post</AlertDialog.Title>
			<AlertDialog.Description>Are you sure you want to delete this post?</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form use:enhance method="POST" action="?/deletePost&id={post.id}">
				<Button class={buttonVariants({ variant: "destructive" })} type="submit">
					Yes, delete.
				</Button>
			</form>
			<AlertDialog.Cancel
				class={buttonVariants({ variant: "outline" })}
				onclick={() => (openStates.deleteDialogOpen = false)}>No, cancel.</AlertDialog.Cancel
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
