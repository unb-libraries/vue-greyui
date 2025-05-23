import { WidgetToggle } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: undefined,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'validate'],
  template: `
    <div>
      <input type="checkbox" data-test="input" @change="$emit('input', !value)" />
      <button data-test="validate" @click.prevent="$emit('validate')" />
      <div data-test="error">{{ error }}</div>
    </div>
  `
})

describe('InputCheckbox', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
      const widget = mount(WidgetToggle, {
        props: {
          // @ts-ignore
          layout: markRaw(Layout),
          modelValue: false,
          label: 'Check me',
          required: false,
          'onUpdate:modelValue': (newValue: boolean) => widget.setProps({ modelValue: newValue }),
          ...props ?? {},
        }
      })
      return widget
    }
  
  test('toggle', async () => {
    const input = mountWidget()
    
    await input.get('[data-test="input"]').trigger('change')
    expect(input.props().modelValue).toBe(true)
    
    await input.get('[data-test="input"]').trigger('change')
    expect(input.props().modelValue).toBe(false)
  })

  describe('Validation', () => {
    it('should fail if unchecked by required', async () => {
      const input = mountWidget({ modelValue: true, required: true })
      
      await input.get('[data-test="input"]').trigger('change')
      expect(input.get('[data-test="error"]').text()).not.toBe('')
    })
  })
})
