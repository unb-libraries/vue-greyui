<template>
  <Story title="Pool" group="content" auto-props-disabled icon="lucide:rows-2">
    <Variant title="Tabs" icon="lucide:folder-closed">
      <ContentPool v-model="tab" :options="tabs" class="w-full text-base-94">
        <div class="w-full ml-50 space-x-25">
          <ContentPoolOptions v-slot="{ option }">
            <InputToggle class="bg-base-54 data-[state=off]:bg-base-44 data-[state=off]:text-base-74 border-none rounded-t-25 px-50r py-25r">
              {{ option }}
            </InputToggle>
          </ContentPoolOptions>
        </div>
        <ContentPoolElect class="w-full bg-base-54 border-none rounded-25 p-100r">
          <template #Colour>
            <ul class="flex flex-col gap-y-25r">
              <li class="inline-flex gap-x-50r items-center"><div class="size-100r border border-white bg-base-14" /><div>Base 14</div></li>
              <li class="inline-flex gap-x-50r items-center"><div class="size-100r border border-white bg-base-24" /><div>Base 24</div></li>
              <li class="inline-flex gap-x-50r items-center"><div class="size-100r border border-white bg-base-34" /><div>Base 34</div></li>
              <li class="inline-flex gap-x-50r items-center"><div class="size-100r border border-white bg-base-44" /><div>Base 44</div></li>
              <li class="inline-flex gap-x-50r items-center"><div class="size-100r border border-white bg-base-54" /><div>Base 54</div></li>
            </ul>
          </template>
          <template #Font>
            <ul class="flex flex-col gap-y-25r">
              <li class="font-sans">White is just another shade of grey.</li>
              <li class="font-serif">White is just another shade of grey.</li>
              <li class="font-mono">White is just another shade of grey.</li>
            </ul>
          </template>
        </ContentPoolElect>
      </ContentPool>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ContentPool, ContentPoolOptions, InputToggle, ContentPoolElect } from '~/components'
import { useDataProvider } from '~/composables'

const tab = ref('Colour')
const { data: tabs } = useDataProvider(['Colour', 'Font'])
</script>