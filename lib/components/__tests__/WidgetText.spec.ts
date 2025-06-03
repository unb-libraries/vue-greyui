import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import { WidgetText } from '../../components'

const Layout = defineComponent({
  
  props: ['value', 'cardinality', 'error'],
  emits: ['input', 'add', 'remove', 'clear', 'validate'],
  template: `
    <div>
      <input v-if="!Array.isArray(value)" type="text" data-test="input" @input.stop="$emit('input', $event.target.value)" />
      <template v-else>
        <input type="text" data-test="add" @input.stop="$emit('add', $event.target.value)" />
        <input type="text" data-test="remove" @input.stop="$emit('remove', $event.target.value)" />
      </template>
      <button data-test="clear" @click.prevent="$emit('clear')" />
      <button data-test="validate" @click.prevent="$emit('validate')" />
      <div data-test="error">{{ error }}</div>
    </div>
  `
})

describe('InputText', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetText, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      },
    })
    return widget
  }

  describe('Single-value', () => {
    test('set', async () => {
      // new value replaces existing one
      const input = mountWidget()
      
      await input.get('[data-test="input"]').setValue("Grey")
      expect(input.props().modelValue).toEqual("Grey")
      
      await input.get('[data-test="input"]').setValue("Light grey")
      expect(input.props().modelValue).toEqual("Light grey")
    })

    describe('clear', () => {
      test('initialized', async () => {
        // "null" if previously initialized
        const input = mountWidget({ modelValue: 'Grey',  })
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toBe(null)
      })
      
      test('uninitialized', async () => {
        // "null" if previously initialized
        const input = mountWidget()
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toBe("")
      })
    })
    
    describe('Validation', () => {
      it('should accept "Light grey"', async () => {
        const input = mountWidget({ modelValue: 'Light grey', pattern: 'grey' })
        await input.get('[data-test="validate"]').trigger("click")
        expect(input.get('[data-test="error"]').text()).toBe("")
      })
      
      it('should reject "White"', async () => {
        const input = mountWidget({ modelValue: 'White', pattern: 'grey' })
        await input.get('[data-test="validate"]').trigger("click")
        expect(input.get('[data-test="error"]').text()).not.toBe("")
      })
    })
  })
  
  describe('Multi-value', async () => {
    describe('add', () => {
      it('should append if valid', async () => {
        const input = mountWidget({ modelValue: ['Grey'], cardinality: 'many', pattern: 'grey' })
        await input.get('[data-test="add"]').setValue("Light grey")
        expect(input.props().modelValue).toEqual(['Grey', 'Light grey'])
      })
      
      it('should reject if invalid', async () => {
        const input = mountWidget({ modelValue: ['Grey'], cardinality: 'many', pattern: 'grey' })
        await input.get('[data-test="add"]').setValue("White")
        expect(input.props().modelValue).toEqual(['Grey'])
        expect(input.get('[data-test="error"]').text()).not.toBe("")
      })
    })

    test('remove', async () => {
      const input = mountWidget({ modelValue: ['Grey'], cardinality: 'many', pattern: 'grey' })
      await input.get('[data-test="remove"]').setValue("Grey")
      expect(input.props().modelValue).toEqual([])
    })
    
    test('clearing should yield "null" if previously initialized', async () => {
      const input = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    test('clearing should yield [] if previously NOT initialized', async () => {
      const input = mountWidget({ cardinality: 'many' })
      await input.setProps({ modelValue: ['Grey'] })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toEqual([])
    })

    test('Validation', async () => {
      const input = mountWidget({ cardinality: 'many', min: 1 })
      await input.get('[data-test="validate"]').trigger("click")
      expect(input.get('[data-test="error"]').text()).not.toEqual("")

      input.setProps({ modelValue: ['Grey'] })
      await input.get('[data-test="validate"]').trigger("click")
      expect(input.get('[data-test="error"]').text()).toEqual("")
    })
  })
})
