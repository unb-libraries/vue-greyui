import { WidgetText } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: Array<String>,
      required: false,
      default: undefined,
    },
    cardinality: {
      type: String,
      required: false,
      default: 'one',
    },
    error: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'clear', 'validate'],
  setup(props, { emit }) {
    return {
      onInput(value: string) {
        emit('input', props.cardinality === 'many' ? [...props.value ?? [], value] : [value])
      }
    }
  },
  template: `
    <div>
      <input type="text" data-test="input" @input="onInput($event.target.value)" />
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
    test('new value should replace the current one', async () => {
      const input = mountWidget()
      
      await input.get('[data-test="input"]').setValue("Grey")
      expect(input.props().modelValue).toEqual("Grey")
      
      await input.get('[data-test="input"]').setValue("Grey")
      expect(input.props().modelValue).toEqual("Grey")
    })

    test('clearing should yield "null" if previously initialized', async () => {
      const input = mountWidget({ modelValue: 'Grey',  })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    test('clearing should yield "" if previously NOT initialized', async () => {
      const input = mountWidget()
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe("")
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
    test('new values should be appended', async () => {
      const input = mountWidget({ cardinality: 'many' })
      await input.get('[data-test="input"]').setValue("Grey")
      await input.get('[data-test="input"]').setValue("Light grey")
      expect(input.props().modelValue).toEqual(["Grey", "Light grey"])
    })
    
    test('clearing should yield "null" if previously initialized', async () => {
      const input = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    test('clearing should yield [] if previously NOT initialized', async () => {
      const input = mountWidget({ cardinality: 'many' })
      await input.get('[data-test="input"]').setValue("Grey")
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toEqual([])
    })

    describe('Validation', () => {
      it('should accept "Light grey"', async () => {
        const input = mountWidget({ modelValue: ['Grey'], cardinality: 'many', pattern: 'grey' })
        await input.get('[data-test="input"]').setValue("Light grey")
        expect(input.get('[data-test="error"]').text()).toBe("")
        expect(input.props().modelValue).toEqual(['Grey', 'Light grey'])
      })
      
      it('should reject "White"', async () => {
        const input = mountWidget({ modelValue: ['Grey'], cardinality: 'many', pattern: 'grey' })
        await input.get('[data-test="input"]').setValue("White")
        expect(input.get('[data-test="error"]').text()).not.toBe("")
        expect(input.props().modelValue).toEqual(['Grey'])
      })
    })
  })
})
