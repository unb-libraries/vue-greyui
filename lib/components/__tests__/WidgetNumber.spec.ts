import { WidgetNumber } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  emits: ['update', 'clear'],
  setup(_, { emit }) {
    return {
      onInput(value: string) {
        const numericValue = Number(value)
        if (!isNaN(numericValue)) {
          emit('update', numericValue)
        }
      }
    }
  },
  template: `
    <div>
      <input type="text" data-test="input" @input="onInput($event.target.value)" />
      <button data-test="clear" @click.prevent="$emit('clear')" />
    </div>
  `
})

describe('InputNumber', () => {
  describe('set value', async () => {
    test('within range', async () => {
      const input = mount(WidgetNumber, { props: { modelValue: 0, layout: markRaw(Layout), 'onUpdate:modelValue': value => input.setProps({ modelValue: value }) } })
      await input.get('[data-test="input"]').setValue("1")
      expect(input.props().modelValue).toBe(1)
    })

    test('out of range', async () => {
      const input = mount(WidgetNumber, { props: { modelValue: 0, min: 0, max: 10, layout: markRaw(Layout), 'onUpdate:modelValue': value => input.setProps({ modelValue: value }) } })
      await input.get('[data-test="input"]').setValue("-1")
      expect(input.props().modelValue).toBe(0)
      await input.get('[data-test="input"]').setValue("11")
      expect(input.props().modelValue).toBe(0)
    })
    
    test('not a number', async () => {
      const input = mount(WidgetNumber, { props: { modelValue: 0, layout: markRaw(Layout), 'onUpdate:modelValue': value => input.setProps({ modelValue: value }) } })
      await input.get('[data-test="input"]').setValue("A")
      expect(input.props().modelValue).toBe(0)
    })
    
  })

  describe('clear value', async () => {
    it('should yield "null" when initialized', async () => {
      const input = mount(WidgetNumber, { props: { modelValue: 1, layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    it('should yield "" when NOT initialized', async () => {
      const input = mount(WidgetNumber, { props: { layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(0)
    })
  })
})
