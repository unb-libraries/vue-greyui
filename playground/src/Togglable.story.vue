<template>
  <Story title="Togglable" auto-props-disabled :layout="{ type: 'single', iframe: false }" icon="lucide:power">
    <template #controls>
      <HstJson v-model="open" title="Open" />
    </template>
    <div class="flex w-full gap-x-50r justify-center">
      <Togglable v-model="open" class="w-1/5">
        <Toggler class="bg-accent hover:bg-accent-60 text-base-94 rounded-25 w-full leading-[1.5em] px-50r py-25r">
          Toggle
        </Toggler>
        <TogglableContent class="flex flex-col bg-base-24 text-base-74 border border-base-44 rounded-25 w-full p-100r gap-y-100r absolute top-[calc(2em+0.25rem)]">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi sunt saepe quia inventore ipsa sint a labore corporis molestias amet voluptatibus, eos doloremque veritatis quisquam modi fuga? Saepe, explicabo magnam!
          </div>
          <button class="bg-base-44 hover:bg-base-64 text-base-94 rounded-25 py-25r px-50r">OK</button>
        </TogglableContent>
      </Togglable>
    </div>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Togglable, Toggler, TogglableContent } from '~/components'

const open = ref(false)
</script>