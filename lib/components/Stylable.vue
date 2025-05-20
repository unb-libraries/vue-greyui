<template>
  <stylable-layout />
</template>

<script lang="ts" setup generic="P, E extends EmitsOptions | Record<string, any[]> = {}">
import type { Component, ComputedOptions, MethodOptions, EmitsOptions } from "vue"
import { computed } from "vue"
import { resolveLayout } from "~/utils"

export type StylableProps<P, E extends EmitsOptions | Record<string, unknown[]> = undefined> = {
  layout?: string | Component<P, unknown, unknown, ComputedOptions, MethodOptions, E>
}

const props = defineProps<StylableProps<P, E>>()


const StylableLayout = computed(() => {
  if (!props.layout || typeof props.layout === 'string') {
    return resolveLayout(this, props.layout as string || 'default')
  }
  return props.layout
})
</script>
