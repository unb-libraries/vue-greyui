import { WidgetCheckbox } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update', 'validate'],
  template: `<input type="checkbox" data-test="input" @change="$emit('update', !value)" />`
})

describe('InputCheckbox', () => {
  test('toggle', async () => {
    const input = mount(WidgetCheckbox, { props: { layout: markRaw(Layout), 'onUpdate:modelValue': value => input.setProps({ modelValue: value }) } })
    
    await input.get('[data-test="input"]').trigger('change')
    expect(input.props().modelValue).toBe(true)
    
    await input.get('[data-test="input"]').trigger('change')
    expect(input.props().modelValue).toBe(false)
  })
})
