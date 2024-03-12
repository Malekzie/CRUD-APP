<script lang='ts'>
     import * as Form from '$lib/components/ui/form/index'
	import { registerSchema } from '$lib/schema';
     import { superForm } from 'sveltekit-superforms';
     import { zodClient } from 'sveltekit-superforms/adapters';

     let { data } = $props()

     const registerForm = superForm(data.registerForm, {
          validators: zodClient(registerSchema),
     })

     const loginForm = superForm(data.loginForm, {
          validators: zodClient(registerSchema),
     })

     const { form: registerFormData } = registerForm;
     const { form: loginFormData } = loginForm;
</script>