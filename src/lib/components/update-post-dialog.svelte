<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { buttonVariants } from './ui/button';
	import { updatePostSchema } from '$lib/zod-schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
     import { toast } from 'svelte-sonner';


	type Props = {
		form: SuperValidated<Infer<typeof updatePostSchema>>;
	};

	let { form: theForm } = $props<Props>();

     let open  = $state(false);

	const form = superForm(theForm, {
		validators: zodClient(updatePostSchema),
          onUpdated: ({ form: updForm,  }) => {
               if (!updForm.valid) return

               // Success, show Toast n close dialog

               toast.success('Post created successfully');
			open = false;
          }
	});

	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Create Post</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a new Post</Dialog.Title>
			<Dialog.Description>Start interacting with the community</Dialog.Description>
		</Dialog.Header>
		<form action="?/createPost" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label class="text-2xl">Title</Form.Label>
					<Input {...attrs} bind:value={$formData.title} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="content">
				<Form.Control let:attrs>
					<Form.Label class="text-2xl">Content</Form.Label>
					<Textarea {...attrs} bind:value={$formData.content} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button>Create Post</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
