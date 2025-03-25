import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent } from 'vue'
import vNav from '../vNav'

const List = defineComponent({
  directives: { nav: vNav },
  template: `
    <ul v-nav="'items'" data-test="list">
      <li v-for="(item, index) in Array.from({ length: 5 }).map((_, i) => i + 1)" :key="item" v-nav.flat="'items'" :data-test="'item-' + item">
        Item {{ item }}
      </li>
    </ul>
  `
})

describe('v-nav', () =>{
  test('id', async () => {
    const wrapper = mount(List, { attachTo: document.body });
    expect(wrapper.findAll('[data-nav-group="items"]')).toHaveLength(6)
    expect(wrapper.findAll('[data-nav-group="items"]').map(el => el.element.getAttribute('tabindex')).every(tabindex => tabindex === '-1')).toBe(true)
  })
  
  test('navigation', async () => {
    const wrapper = mount(List, { attachTo: document.body });
    (wrapper.get('[data-test="item-1"]').element as HTMLElement).focus()
    
    await wrapper.get('[data-test="list"]').trigger('keyup.Enter')
    expect(wrapper.get('[data-test="item-1"]').element).toBe(document.activeElement)
    
    await wrapper.get('[data-test="item-1"]').trigger('keyup.ArrowRight')
    expect(wrapper.get('[data-test="item-2"]').element).toBe(document.activeElement)
    
    await wrapper.get('[data-test="item-2"]').trigger('keyup.ArrowRight')
    expect(wrapper.get('[data-test="item-3"]').element).toBe(document.activeElement)
    
    await wrapper.get('[data-test="item-3"]').trigger('keyup.ArrowRight')
    expect(wrapper.get('[data-test="item-4"]').element).toBe(document.activeElement)
    
    await wrapper.get('[data-test="item-4"]').trigger('keyup.ArrowRight')
    expect(wrapper.get('[data-test="item-5"]').element).toBe(document.activeElement)
    
    await wrapper.get('[data-test="item-5"]').trigger('keyup.Escape')
    expect(wrapper.get('[data-test="list"]').element).toBe(document.activeElement)
  })
})