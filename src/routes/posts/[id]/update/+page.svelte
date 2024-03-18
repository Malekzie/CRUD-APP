<script lang="ts">
	//ShadCN
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { toast } from "svelte-sonner";

	import { updatePostSchema } from "$lib/zod-schema";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { PageData } from "../$types.js";

	type Props = {
		data: PageData;
		dialog: boolean;
	};

	let { data, dialog = false } = $props<Props>();

	let dialogOpen = $state(true);

	const form = superForm(data.updatePostForm, {
		validators: zodClient(updatePostSchema),
		onUpdated: ({ form: updForm }) => {
			if (!updForm.valid) return;

			// Success, show Toast n close dialog

			toast.success("Post updated successfully");
			//close dialog
			if (dialog) dialogOpen = false;
		},
		resetForm: false,
	});

	const { form: formData, enhance } = form;
</script>

{#snippet UpdateForm()}
	<form action="?/updatePost" method="POST" use:enhance class="space-y-4">
		<Form.Field {form} name="title">
			<Form.Control let:attrs>
				<Form.Label class="text-2xl">Title</Form.Label>
				<Input {...attrs} bind:value={$formData.title} />
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="content">
			<Form.Control let:attrs>
				<Form.Label class="text-2xl">Content</Form.Label>
				<Textarea {...attrs} bind:value={$formData.content} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Update Post</Form.Button>
	</form>
{/snippet}

{#if dialog}
	<!-- Will show as a dialog instead of a full page -->
	<Dialog.Root
		bind:open={dialogOpen}
		onOpenChange={(o) => {
			if (!o) history.back();
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Edit Post</Dialog.Title>
			</Dialog.Header>
			{@render UpdateForm()}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<!-- Will show if user clicks on post, then it becomes a page -->
	<div class="container max-w-xl mx-auto">
		<Card.Root>
			<Card.Header>
				<Card.Title>Update Post</Card.Title>
			</Card.Header>
			<Card.Content>
				{@render UpdateForm()}
			</Card.Content>
		</Card.Root>
	</div>
{/if}
