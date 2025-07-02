<template>
  <Story title="Text" auto-props-disabled group="widgets" icon="lucide:text-cursor-input">
    <template #controls>
      <HstJson v-model="state.value" title="Value" />
      <HstSelect
        v-model="state.submitOn"
        title="Submit on"
        :options="{ input: 'Input', unfocus: 'Blur' }"
      />
    </template>
    
    <Widget ref="inputTextWidget" v-model="state.value" class="widget data-[invalid]:border-red">
      <InputText :update-on="state.submitOn" class="input" />
    </Widget>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Widget, InputText } from '~/components'

const state = reactive({
  value: '',
  submitOn: 'input' as 'input' | 'unfocus',
})
</script>