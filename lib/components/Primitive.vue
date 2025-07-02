<template>
  <RekaPrimitive :as="as" :as-child="asChild">
    <slot />
  </RekaPrimitive>
</template>

<script lang="ts" setup>
import { Primitive as RekaPrimitive, type PrimitiveProps as RekaPrimitiveProps } from 'reka-ui'
export type PrimitiveProps = RekaPrimitiveProps
defineProps<RekaPrimitiveProps>()
</script>