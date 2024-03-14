<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import type { PostWithUser } from '$lib/server/schemas';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { EllipsisVertical, Trash2, SquarePen, Square } from 'lucide-svelte';
	import { buttonVariants } from './ui/button';

	type Props = {
		post: PostWithUser;
	};

	let { post } = $props<Props>();

	let deleteDialogOpen = $state(false);

	let editDialogOpen = $state(false);
</script>

<Card.Root>
	<Card.Header class="flex-row items-center justify-between">
		<Card.Title>{post.title}</Card.Title>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ size: 'icon', variant: 'ghost' })}>
				<EllipsisVertical />
				<span class="sr-only">Post options</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>
					<SquarePen class="mr-2 size-4" />
					Edit
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => (deleteDialogOpen = true)}>
					<Trash2 class="mr-2 size-4" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Card.Header>
	<Card.Content>
		{post.content}
	</Card.Content>
	<Card.Footer>
		{post.user.username}
	</Card.Footer>
</Card.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
     <AlertDialog.Content>

          <AlertDialog.Header>
               <AlertDialog.Title>Delete Post</AlertDialog.Title>
               <AlertDialog.Description>Are you sure you want to delete this post?</AlertDialog.Description>
          </AlertDialog.Header>
          
          <AlertDialog.Footer>
               <Button tabindex={0} variant="destructive" type="button">Yes, delete.</Button>
               <Button variant="outline" onclick={() => (deleteDialogOpen = false)}>No, cancel.</Button>
          </AlertDialog.Footer>
     </AlertDialog.Content>
</AlertDialog.Root>
