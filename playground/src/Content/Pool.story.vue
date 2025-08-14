<template>
  <Story title="Pool" group="content" auto-props-disabled icon="lucide:rows-2">
    <Variant title="Tabs" icon="lucide:folder-closed">
      <ContentPool v-model="tab" :options="tabs" class="w-full text-base-94">
        <div class="w-full ml-50 space-x-25">
          <ContentPoolOptions v-slot="{ option, selected }">
            <InputToggle :disabled="selected" class="bg-base-54 data-[state=off]:bg-base-44 data-[state=off]:text-base-74 border-none rounded-t-25 px-50r py-25r">
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

    <Variant title="Accordion" icon="lucide:panel-top-open">
      <template #controls>
        <HstJson v-model="selected" title="Selected" />
        <HstSelect v-model="cardinality" title="Cardinality" :options="['one', 'many']" />
      </template>

      <ContentPool
        v-model="selected"
        :cardinality="cardinality"
        :key="cardinality"
        :options="items"
        class="w-full text-base-94"
      >
        <div class="flex flex-col w-full bg-base-34 border border-base-44 rounded-25 overflow-hidden">
          <ContentPoolOptions v-slot="{ option, selected }">
            <div class="group border-b border-base-44 last:border-b-0">
              <InputToggle class="group flex justify-between text-start items-center w-full p-50r hover:bg-base-44">
                <span>{{ (option as Item).title }}</span>
                <Icon name="chevron" class="group-data-[state=on]:rotate-180 transition-transform duration-300" />
              </InputToggle>
              <ContentPoolItem class="p-100r text-85">
                <div class="p-100r bg-base-24 rounded-25">
                  {{ (option as Item).content }}
                </div>
              </ContentPoolItem>
            </div>
          </ContentPoolOptions>
        </div>
      </ContentPool>
    </Variant>

    <Variant title="Carousel" icon="lucide:gallery-horizontal">
      <template #controls>
        <HstJson v-model="image" title="Image" />
      </template>
      
      <ContentPool v-model="image" :options="images" class="flex flex-col w-full gap-y-25">
        <ContentPoolElect v-slot="{ tab }" class="w-full aspect-3/2">
          <img :src="(tab as string)" class="object-cover size-full" />
        </ContentPoolElect>
        <div class="grid grid-cols-5 w-full gap-x-25">
          <ContentPoolOptions v-slot="{ option, selected }">
            <InputToggle :disabled="selected">
              <img :src="(option as string)" class="aspect-3/2 size-full hover:cursor-pointer hover:opacity-50" />
            </InputToggle>
          </ContentPoolOptions>
        </div>
      </ContentPool>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ContentPool, ContentPoolOptions, InputToggle, ContentPoolItem, ContentPoolElect } from '~/components'
import { useDataProvider } from '~/composables'
import { Icon } from '@playground'

const tab = ref('Colour')
const { data: tabs } = useDataProvider(['Colour', 'Font'])

type Item = { title: string; content: string }
const { data: items } = useDataProvider<Item>([
  {
    title: 'Profile',
    content: 'This is your profile. You control what you share.',
  },
  {
    title: 'Account',
    content: 'How you login goes here.',
  },
  {
    title: 'Billing',
    content: 'Setup a payment plan here.'
  },
])

const cardinality = ref<'one' | 'many'>('one')
const selected = ref<string | string[]>()

watch(cardinality, cardinality => {
  if (cardinality === 'one' && Array.isArray(selected.value)) {
    selected.value = selected.value.at(-1) || ''
  } else if (cardinality === 'many') {
    selected.value = [selected.value].filter(Boolean) as string[]
  }
})

const { data: images } = useDataProvider([
  'https://picsum.photos/id/1015/600/400',
  'https://picsum.photos/id/1016/600/400',
  'https://picsum.photos/id/1018/600/400',
  'https://picsum.photos/id/1020/600/400',
  'https://picsum.photos/id/1024/600/400',
])
const image = ref(Object.values(images.value)[0])
</script>