<template>
  <Story title="Collection" auto-props-disabled icon="lucide:boxes">
    <div class="grid grid-cols-5 gap-50">
      <Collection :items="items" v-slot="{ item }">
        <img :src="(item as string)" class="hover:sepia cursor-pointer" />
      </Collection>
    </div>
  </Story>
</template>

<script lang="ts" setup>
import { Collection } from '~/components'
const items = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i, `https://picsum.photos/320/240?random=${i}`]))
</script>