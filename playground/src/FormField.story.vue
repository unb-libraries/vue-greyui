<template>
  <Story title="Form field" auto-props-disabled icon="lucide:notepad-text">
    <template #controls>
      <HstJson v-model="values" title="Values" />
    </template>
    
    <GreyForm
      ref="form"
      id="personal"
      class="flex flex-col gap-y-100 text-base-94"
      @submit.prevent="onSubmit"
      v-slot="{ errors, valid }"
    >
      <h1 class="text-125">Personal information</h1>
      <div v-if="submitted" class="px-50 py-25 rounded-25 bg-accent-50 text-base-94">
        Thank you for your submission!
      </div>
      <template v-else>
        <div v-for="(err, field) of errors.value" class="px-50 py-25 rounded-25 bg-red text-base-94">
          {{ field.split('-').join(' ') }}: {{ err.join(', ') }}
        </div>
      </template>
      <GreyFormField name="first-name" class="flex flex-col gap-y-50">
        <GreyFormFieldLabel class="font-bold">First name</GreyFormFieldLabel>
        <GreyWidget v-model="firstName" as-child>
          <InputText class="widget" />
        </GreyWidget>
      </GreyFormField>
      <GreyFormField name="last-name" class="flex flex-col gap-y-50">
        <GreyFormFieldLabel class="font-bold">Last name</GreyFormFieldLabel>
        <GreyWidget
          v-model="lastName"
          as-child
          :validators="{ required: (v) => v.length > 0 }"
        >
          <InputText class="widget data-[status=invalid]:border-red" update-on="unfocus" />
        </GreyWidget>
      </GreyFormField>
      <div class="flex gap-x-25">
        <GreyFormSubmit class="text-base-94 bg-accent-50 hover:bg-accent-60 disabled:bg-accent-30 disabled:text-base-64 px-50 py-25 rounded-25 w-fit" strict>Submit</GreyFormSubmit>
        <GreyFormClear class="text-base-94 bg-base-34 border border-base-54 hover:border-accent-50 px-50 py-25 rounded-25 w-fit ml-50">Clear</GreyFormClear>
      </div>
    </GreyForm>
  </Story>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import {
  FormInterface,
  Form as GreyForm,
  FormField as GreyFormField,
  FormFieldLabel as GreyFormFieldLabel,
  FormSubmit as GreyFormSubmit,
  FormClear as GreyFormClear,
  Widget as GreyWidget,
  InputText,
} from '~/components'

const form = ref<FormInterface>()

const firstName = ref('')
const lastName = ref('')

const values = computed({
  get: () => ({
    firstName: firstName.value,
    lastName: lastName.value,
  }),
  set: (json) => {
    firstName.value = json.firstName
    lastName.value = json.lastName
  }
})

const submitted = ref(false)
watch(submitted, s => {
  if (s) {
    setTimeout(() => submitted.value = false, 3000)
  }
})

function onSubmit() {
  form.value?.clear()
  submitted.value = true
}
</script>