<script lang='ts'>
     import * as Form from '$lib/components/ui/form/index.js'
	import Input from '$lib/components/ui/input/input.svelte';
	import { registerSchema } from '$lib/schema.js';
     import { superForm } from 'sveltekit-superforms';
     import { zodClient } from 'sveltekit-superforms/adapters';

     let { data } = $props()

     const registerForm = superForm(data.registerForm, {
          validators: zodClient(registerSchema),
     })

     const loginForm = superForm(data.loginForm, {
          validators: zodClient(registerSchema),
     })

     const { form: registerFormData, enhance } = registerForm;
     const { form: loginFormData } = loginForm;
</script>

<div class="flex max-w-xl pt-8 mx-auto">

     <form method="POST" action="?/register" use:enhance class="w-full space-y-4">
          <Form.Field form={registerForm} name="username">
               <Form.Control let:attrs>
                    <Form.Label>Username</Form.Label>
                    <Input type="text" {...attrs} bind:value={$registerFormData.username} />
               </Form.Control>
               <Form.FieldErrors />
          </Form.Field>
          <Form.Field form={registerForm} name="password">
               <Form.Control let:attrs>
                    <Form.Label>Password</Form.Label>
                    <Input type="text" {...attrs} bind:value={$registerFormData.password} />
               </Form.Control>
               <Form.FieldErrors />
          </Form.Field>
          <Form.Field form={registerForm} name="confirmPassword">
               <Form.Control let:attrs>
                    <Form.Label>Password Confirmation</Form.Label>
                    <Input type="text" {...attrs} bind:value={$registerFormData.confirmPassword} />
               </Form.Control>
               <Form.FieldErrors />
          </Form.Field>
          <Form.Button>Register</Form.Button>
     </form>
</div>