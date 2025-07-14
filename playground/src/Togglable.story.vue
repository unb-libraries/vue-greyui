<template>
  <Story title="Togglable" auto-props-disabled :layout="{ type: 'single', iframe: false }" icon="lucide:power">
    <template #controls>
      <HstJson v-model="open" title="Open" />
    </template>

    <Variant title="Manual" icon="lucide:mouse-pointer-click">
      <div class="flex w-full gap-x-50r justify-center">
        <Togglable v-model="open" class="w-1/4">
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
    </Variant>

    <Variant title="Auto" icon="lucide:square-dashed-mouse-pointer">
      <div class="flex w-full gap-x-50r justify-center">
        <Togglable v-model="open" class="w-1/4">
          <AutoToggler class="relative z-[1] bg-base-24 border border-base-44 border-dashed text-base-94 w-full text-center leading-[1.5em] px-50r py-25r" tabindex="0">
            Toggle
          </AutoToggler>
          
          <div class="absolute top-0 left-0 h-[calc(100%+0.25rem)] w-full">
            <TogglableContent class="flex flex-col bg-base-24 text-base-74 border border-base-44 rounded-25 w-full p-100r gap-y-100r absolute top-[calc(2em+0.25rem)]">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi sunt saepe quia inventore ipsa sint a labore corporis molestias amet voluptatibus, eos doloremque veritatis quisquam modi fuga? Saepe, explicabo magnam!
              </div>
              <button class="bg-base-44 hover:bg-base-64 text-base-94 rounded-25 py-25r px-50r">OK</button>
            </TogglableContent>
          </div>
        </Togglable>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Togglable, Toggler, AutoToggler, TogglableContent } from '~/components'

const open = ref(false)
</script>