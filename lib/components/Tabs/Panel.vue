<template>
  <Primitive :as="as">
    <KeepAlive>
      <component :is="activeTab">
        <slot :tab="selected">
          <slot :name="content.get(selected).id" :tab="selected" />
        </slot>
      </component>
    </KeepAlive>
  </Primitive>
</template>

<script lang="ts" setup generic="T">
import { computed, inject } from 'vue'
import TabContent from './Content.vue'
import { Primitive, type PrimitiveProps, type WidgetInjection, type WidgetOptionsInjection } from '~/components'

defineOptions({ name: 'TabsPanel' })
defineProps<Pick<PrimitiveProps, 'as'>>()

const { value: selected } = inject<WidgetInjection<T, 'one'>>('widget')
const { options: tabs } = inject<WidgetOptionsInjection<T, 'one'>>('widget-options', { options: {} })

const content = computed(() => new Map<T, { id: string, content: typeof TabContent }>(Object
  .entries(tabs)
  .map(([id, tab]) => [tab, { id, content: TabContent }])))
const activeTab = computed(() => content.value.get(selected.value).content)
</script>