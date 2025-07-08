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

    <Variant title="Checkbox" v-model="state.checkbox.value" icon="lucide:check">
      <template #controls>
        <HstJson v-model="state.checkbox.value" title="Value" />
        <HstButton color="primary" class="htw-p-2" @click="state.checkbox.value = 'indeterminate'">
          Indeterminate
        </HstButton>
      </template>

      <Widget v-model="state.checkbox.value" class="text-100">
        <div class="inline-flex items-center gap-50 w-full text-base-94">
          <InputCheckbox id="chckbx" class="widget cursor-pointer p-0 text-75r w-fit aspect-square data-[checked]:bg-accent focus-within:data-[checked]:bg-accent-60 hover:data-[checked]:bg-accent-60" />
          <label for="chckbx" class="cursor-pointer">White is just another shade of grey.</label>
        </div>
      </Widget>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { Widget, InputText, InputNumber, InputCheckbox } from '~/components'

const state = reactive({
  text: {
    value: '',
    submitOn: 'input' as 'input' | 'unfocus',
  },
  number: {
    value: 1000,
    format: 'currency',
  },
  checkbox: {
    value: false as boolean | 'indeterminate',
  }
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