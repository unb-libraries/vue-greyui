import { WidgetText } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['update', 'clear', 'validate'],
  template: `
    <div>
      <input type="text" data-test="input" @input="$emit('update', $event.target.value)" />
      <button data-test="clear" @click.prevent="$emit('clear')" />
      <button data-test="validate" @click.prevent="$emit('validate')" />
    </div>
  `
})

describe('InputText', () => {
  test('set value', async () => {
    const input = mount(WidgetText, { props: { layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
    await input.get('[data-test="input"]').setValue("Grey")
    expect(input.props().modelValue).toBe("Grey")
  })

  describe('clear value', async () => {
    it('should yield "null" when initialized', async () => {
      const input = mount(WidgetText, { props: { modelValue: 'Grey', layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    it('should yield "" when NOT initialized', async () => {
      const input = mount(WidgetText, { props: { layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe("")
    })
  })
  
  test('validate', async () => {
    const input = mount(WidgetText, { props: { layout: markRaw(Layout), 'onUpdate:modelValue': value =>  input.setProps({ modelValue: value }) } })
    await input.get('[data-test="validate"]').trigger('click')
    expect(input.emitted()).toHaveProperty("validated")
    expect(input.props().valid).not.toBe(undefined)
  })
})
