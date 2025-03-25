import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent, ref } from 'vue'
import { focusChild, focusNextSibling, focusPreviousSibling } from '../focus'

const List = defineComponent({
  setup() {
    const ul = ref<HTMLElement>()
    const items = ref<HTMLElement[]>([])
    return { ul, items, focusChild, focusNextSibling, focusPreviousSibling }
  },
  template: `
    <ul ref="ul" data-test="list" @focus="focusChild(ul)">
      <li ref="items" v-for="(item, index) in Array.from({ length: 5 }).map((_, i) => i + 1)" :key="item" :data-test="'item-' + item"
        @keyup.left.prevent.stop="focusPreviousSibling(items[index])"
        @keyup.right.prevent.stop="focusNextSibling(items[index])"
      >
      Item {{ item }}
      </li>
    </ul>
  `
})

describe('focus', () =>{
  test('focusNextSibling', async () => {
    const wrapper = mount(List, { attachTo: document.body });
    (wrapper.get('[data-test="item-1"]').element as HTMLElement).focus()

    await wrapper.get('[data-test="item-1"]').trigger('keyup.right')
    expect(wrapper.get('[data-test="item-2"]').element).toBe(document.activeElement)
  })
  
  test('focusPreviousSibling', async () => {
    const wrapper = mount(List, { attachTo: document.body });
    (wrapper.get('[data-test="item-5"]').element as HTMLElement).focus()

    await wrapper.get('[data-test="item-5"]').trigger('keyup.left')
    expect(wrapper.get('[data-test="item-4"]').element).toBe(document.activeElement)
  })
  
  test('focusChild', async () => {
    const wrapper = mount(List, { attachTo: document.body });
    (wrapper.get('[data-test="list"]').element as HTMLElement).focus()
    expect(wrapper.get('[data-test="item-1"]').element).toBe(document.activeElement)
  })
})