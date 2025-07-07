<template>
  <Story title="Input" auto-props-disabled group="widgets" icon="lucide:text-cursor-input">
    <Variant title="Text" icon="lucide:case-lower">
      <template #controls>
        <HstJson v-model="state.text.value" title="Value" />
        <HstSelect
          v-model="state.text.submitOn"
          title="Submit on"
          :options="{ input: 'Input', unfocus: 'Blur' }"
        />
      </template>

      <Widget ref="inputTextWidget" v-model="state.text.value" class="widget data-[invalid]:border-red">
        <InputText :update-on="state.text.submitOn" class="input" />
      </Widget>
    </Variant>
    
    <Variant title="Number" icon="lucide:binary">
      <template #controls>
        <HstJson v-model="state.number.value" title="Value" />
        <HstSelect v-model="state.number.format" title="Format" :options="Array.from(numberFormats.keys())" />
      </template>

      <Widget ref="inputTextWidget" v-model="state.number.value" class="widget data-[invalid]:border-red">
        <InputNumber class="input" :format="selectedFormat" />
      </Widget>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { Widget, InputText, InputNumber } from '~/components'

const state = reactive({
  text: {
    value: '',
    submitOn: 'input' as 'input' | 'unfocus',
  },
  number: {
    value: 1000,
    format: 'currency',
  },
})

const numberFormats = new Map<string, Intl.NumberFormat>()
  .set('currency', new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }))
  .set('decimal', new Intl.NumberFormat('en-CA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }))
  .set('distance', new Intl.NumberFormat('en-CA', {
    style: 'unit',
    unit: 'kilometer',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    unitDisplay: 'narrow',
  }))
const selectedFormat = computed(() => numberFormats.get(state.number.format))
</script>