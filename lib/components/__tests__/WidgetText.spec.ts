import { WidgetText } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
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
    </div>
  `
})

describe('InputText', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetText, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        valid: undefined,
        error: undefined,
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
  })
})
