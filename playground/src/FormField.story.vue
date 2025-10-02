<template>
  <Story title="Form field" auto-props-disabled icon="lucide:notepad-text">
    <template #controls>
      <HstJson v-model="values" title="Values" />
    </template>
    <GreyForm id="personal" class="flex flex-col gap-y-100 text-base-94">
      <h1 class="text-125">Personal information</h1>
      <GreyFormField name="first-name" class="flex flex-col gap-y-50">
        <GreyFormFieldLabel class="font-bold">First name</GreyFormFieldLabel>
        <GreyWidget v-model="firstName" as-child>
          <InputText class="widget" />
        </GreyWidget>
      </GreyFormField>
      <GreyFormField name="last-name" class="flex flex-col gap-y-50">
        <GreyFormFieldLabel class="font-bold">Last name</GreyFormFieldLabel>
        <GreyWidget v-model="lastName" as-child :validators="{ required: (v) => v.length > 0 }">
          <InputText class="widget data-[status=invalid]:border-red" update-on="unfocus" />
        </GreyWidget>
      </GreyFormField>
    </GreyForm>
  </Story>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  Form as GreyForm,
  FormField as GreyFormField,
  FormFieldLabel as GreyFormFieldLabel,
  Widget as GreyWidget,
  InputText,
} from '~/components'

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
</script>