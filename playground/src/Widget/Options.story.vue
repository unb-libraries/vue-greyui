<template>
  <Story title="Options" auto-props-disabled group="widgets" icon="lucide:list-checks">
    <template #controls>
      <HstJson v-model="selection" title="Selection" />
      <HstSelect v-model="cardinality" :options="['one', 'many']" title="Cardinality" />
    </template>
    <WidgetOptions v-model="selection" :key="cardinality"
      :options="options"
      :cardinality="cardinality"
      class="space-y-25r"
    >
      <WidgetOptionsCollection v-slot="{ option, id }">
        <div class="inline-flex items-center gap-50 w-full text-base-94">
          <InputCheckbox class="widget cursor-pointer p-0 text-75r w-fit aspect-square checked:bg-accent focus-within:checked:bg-accent-60 hover:checked:bg-accent-60"
          />
          <label :for="id" class="cursor-pointer">{{ option }}</label>
        </div>
      </WidgetOptionsCollection>
    </WidgetOptions>
  </Story>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { InputCheckbox, WidgetOptions, WidgetOptionsCollection } from '~/components'
import { useDataProvider } from '~/composables'

const selection = ref<string | string[]>([])
const cardinality = ref<'one' | 'many'>('many')
const { data: options } = useDataProvider(['Grey', 'Light grey', 'Dark grey'])

watch(cardinality, cardinality => {
  if (cardinality === 'one' && Array.isArray(selection.value)) {
    selection.value = selection.value.at(-1) || ''
  } else if (cardinality === 'many') {
    selection.value = [selection.value].filter(Boolean) as string[]
  }
})

</script>