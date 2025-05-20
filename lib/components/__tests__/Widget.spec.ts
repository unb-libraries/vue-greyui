import { Widget } from '..'
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
    valid: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    error: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'clear', 'validate'],
  template: `
    <div>
      <div v-for="(value,key) of $props" :key="key" :data-test="key">
        <div v-if="Array.isArray(value)"><span v-for="(v, i) in value" :key="v" :data-test="key + '.' + i">{{ v }}</span></div>
        <template v-else>{{ value }}</template>
      </div>
      <input data-test="input" @input="$emit('input', $event.target.value)" />
      <button data-test="clear" @click="$emit('clear')" />
      <button data-test="validate" @click="$emit('validate')" />
    </div>
  `
})

describe('Widget', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(Widget, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        valid: undefined,
        error: undefined,
        emptyValue: '',
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }
  
  test('value', async () => {
    const widget = mountWidget()
    await widget.get('[data-test="input"]').setValue('Grey')
    expect(widget.get('[data-test="value"]').text()).toBe('Grey')
  })

  describe('clear', () => {
    it('should reset to "" if not initialized', async () => {
      const widget = mountWidget()
      await widget.get('[data-test="clear"]').trigger('click')
      expect(widget.props().modelValue).toBe('')
      expect(widget.get('[data-test="value"]').text()).toBe('')
    })
    
    it('should reset to "null" if initialized', async () => {
      const widget = mountWidget({ modelValue:'Grey' })
      await widget.get('[data-test="clear"]').trigger('click')
      expect(widget.props().modelValue).toBe(null)
      expect(widget.get('[data-test="value"]').text()).toBe('')
    })
  })

  describe('validation', async () => {
    it('should validate automatically', async () => {
      const widget = mountWidget({ autoValidate: true, validators: [(value: string) => value === 'Grey' || "Must be 'Grey'"] })
      
      await widget.get('[data-test="input"]').setValue('Grey')
      await widget.get('[data-test="input"]').setValue('White')
      
      expect(widget.emitted()).toHaveProperty('validated')
      expect(widget.emitted('validated')).toHaveLength(2)
      expect(widget.emitted('validated')[0]).toEqual([true, undefined])
      expect(widget.emitted('validated')[1]).toEqual([false, "Must be 'Grey'"])
    })
    
    it('should validate on demand', async () => {
      const widget = mountWidget({ validators: [() => true] })
      
      await widget.get('[data-test="input"]').setValue('Grey')
      expect(widget.emitted()).not.toHaveProperty('validated')
      
      await widget.get('[data-test="input"]').setValue('White')
      await widget.get('[data-test="validate"]').trigger('click')
      expect(widget.emitted()).toHaveProperty('validated')
      expect(widget.emitted('validated')).toHaveLength(1)
    })
  })
})
