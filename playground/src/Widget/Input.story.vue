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

    <Variant title="Checkbox" icon="lucide:square-check">
      <template #controls>
        <HstJson v-model="state.checkbox.value" title="Value" />
        <HstButton color="primary" class="htw-p-2" @click="state.checkbox.value = 'indeterminate'">
          Indeterminate
        </HstButton>
      </template>

      <Widget v-model="state.checkbox.value" class="text-100" v-slot="{ id }">
        <div class="inline-flex items-center gap-50 w-full text-base-94">
          <InputCheckbox class="widget cursor-pointer p-0 text-75r w-fit aspect-square data-[state=checked]:bg-accent focus-within:data-[state=checked]:bg-accent-60 hover:data-[state=checked]:bg-accent-60 data-[state=indeterminate]:bg-accent focus-within:data-[state=indeterminate]:bg-accent-60 hover:data-[state=indeterminate]:bg-accent-60" />
          <label :for="id" class="cursor-pointer">White is just another shade of grey.</label>
        </div>
      </Widget>
    </Variant>

    <Variant title="Select all" icon="lucide:folder-check">
      <template #controls>
        <HstJson v-model="state.selectAll.selection" title="Value" />
      </template>
      
      <WidgetOptions v-model="state.selectAll.selection"
        :options="state.selectAll.options"
        cardinality="many"
        class="space-y-25r"
        v-slot="{ id }"
      >
        <WidgetOptionsCollection v-slot="{ option, id }">
          <div class="inline-flex items-center gap-50 w-full text-base-94">
            <InputCheckbox class="widget cursor-pointer p-0 text-75r w-fit aspect-square checked:bg-accent focus-within:checked:bg-accent-60 hover:checked:bg-accent-60"
            />
            <label :for="id" class="cursor-pointer">{{ option }}</label>
          </div>
        </WidgetOptionsCollection>
        <div class="inline-flex items-center gap-50 w-full text-base-94">
          <InputCheckboxAll class="widget cursor-pointer p-0 text-75r w-fit aspect-square data-[state=checked]:bg-accent focus-within:data-[state=checked]:bg-accent-60 hover:data-[state=checked]:bg-accent-60 data-[state=indeterminate]:bg-accent focus-within:data-[state=indeterminate]:bg-accent-60 hover:data-[state=indeterminate]:bg-accent-60" />
          <label :for="`${id}[__all__]`" class="cursor-pointer">All of the above</label>
        </div>
      </WidgetOptions>
    </Variant>

    <Variant title="Radio" v-model="state.radio.value" icon="lucide:circle-check">
      <template #controls>
        <HstJson v-model="state.radio.value" title="Value" />
      </template>

      <Widget v-model="state.radio.value" class="text-100" v-slot="{ name }">
        <div class="flex flex-col gap-y-50r">
          <div v-for="option in ['Grey', 'Light grey', 'Dark grey']" :key="option" class="inline-flex items-center gap-50 w-full text-base-94">
            <InputRadio class="widget cursor-pointer p-0 text-75r w-fit rounded-full aspect-square checked:bg-accent focus-within:checked:bg-accent-60 hover:checked:bg-accent-60" :value="option" />
            <label :for="`${name}[${option}]`" class="cursor-pointer">{{ option }}</label>
          </div>
        </div>
      </Widget>
    </Variant>

    <Variant title="Toggle" icon="lucide:power">
      <template #controls>
        <HstJson v-model="state.toggle.value" title="State" />
      </template>

      <Widget v-model="state.toggle.value" as-child>
        <InputToggle class="w-1/4 text-base-94 rounded-25 px-50r py-25r data-[state=on]:bg-accent data-[state=off]:bg-red" />
      </Widget>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { Widget, InputText, InputNumber, InputCheckbox, InputRadio, WidgetOptions, WidgetOptionsCollection, InputCheckboxAll, InputToggle } from '~/components'
import { useDataProvider } from '~/composables'

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
  },
  selectAll: {
    selection: [] as string[],
    value: false as boolean | 'indeterminate',
    options: useDataProvider(['Grey', 'Light grey', 'Dark grey']).data,
  },
  radio: {
    value: undefined as string,
  },
  toggle: {
    value: false,
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