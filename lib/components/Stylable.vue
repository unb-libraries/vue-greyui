<template>
  <stylable-layout />
</template>

<script lang="ts" setup generic="P, E extends EmitsOptions | Record<string, any[]> = {}">
import type { Component, ComputedOptions, MethodOptions, EmitsOptions } from "vue"
import { computed } from "vue"
import { layoutLoader } from "~/utils"

export type StylableProps<P, E extends EmitsOptions | Record<string, unknown[]> = undefined> = {
  layout?: string | Component<P, unknown, unknown, ComputedOptions, MethodOptions, E>
}

const props = defineProps<StylableProps<P, E>>()

const StylableLayout = computed(() => {
  let layout
  if (!props.layout || typeof props.layout === 'string') {
    layout = layoutLoader.loadLayout(props.layout as string)
    return layout.default
  }
  return props.layout
})
</script>
