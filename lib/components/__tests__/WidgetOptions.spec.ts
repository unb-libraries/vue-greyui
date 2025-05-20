import { WidgetOptions } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, markRaw, ref } from 'vue'
import { useDataProvider } from '~/composables'

const Layout = defineComponent({
  props: {
    value: {
      type: Array<String>,
      required: false,
      default: [],
    },
    options: {
      type: Array,
      required: true,
    },
    labelKey: {
      type: String,
      required: false,
      default: undefined,
    },
    optionKey: {
      type: String,
      required: false,
      default: undefined,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 1,
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
  emits: ['toggle', 'add', 'filter', 'clear', 'validate'],
  setup(props, { emit }) {
    let index = 0
    return {
      onToggle() {
        emit('toggle', props.options[index++ % props.options.length])
      },
      onAdd(value: string) {
        emit('add', value)
      },
      onFilter(filter: string) {
        const pattern = new RegExp(`^${filter}`)
        emit('filter', (value: string) => pattern.test(value))
      },
      onClear() {
        emit('clear')
      },
      onValidate() {
        emit('validate')
      },
    }
  },
  template: `
    <div>
      <div v-for="(value,key) of $props" :key="key" :data-test="key">
        <div v-if="Array.isArray(value)"><span v-for="(v, i) in value" :key="v" :data-test="key + '.' + i">{{ v }}</span></div>
        <template v-else>{{ value }}</template>
      </div>
      <button data-test="toggle" @click="onToggle">Toggle</button>
      <input data-test="other" @input="onAdd($event.target.value)" />
      <input data-test="filter" @input="onFilter($event.target.value)" />
      <button data-test="clear" @click="onClear">Clear</button>
      <button data-test="validate" @click="onClear">Validate</button>
    </div>
  `
})

describe('WidgetSelect', async () => {
  vi.mock('~/composables/useDataProvider', () => ({
    useDataProvider(data: string[]) {
      let values = ref(data)
      return {
        data: values,
        add(value: string) {
          values.value = [...values.value, value]
        },
        filter(filter: (term: string) => boolean) {
          values.value = values.value.filter(filter)
        },
      }
    }
  }))

  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetOptions, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        valid: undefined,
        error: undefined,
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }

  test('Props', async () => {
    const wrapper = mountWidget({ options: useDataProvider([]), min: 1, max: 3 })

    expect(wrapper.get('[data-test="min"]').text()).toBe('1')
    expect(wrapper.get('[data-test="max"]').text()).toBe('1')
    
    await wrapper.setProps({ cardinality: 'many' })
    expect(wrapper.get('[data-test="min"]').text()).toBe('1')
    expect(wrapper.get('[data-test="max"]').text()).toBe('3')
  })
  
  describe('Single select', () => {
    test('toggle', async () => {
      const wrapper = mountWidget({ options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })

      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    
      await wrapper.get('[data-test="toggle"]').trigger('click')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.get('[data-test="value.0"]').text()).toBe('Grey')
    })

    test('clear', async () => {
      const wrapper = mountWidget({ modelValue: 'Grey', options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })

      await wrapper.get('[data-test="clear"]').trigger('click')
      expect(wrapper.props().modelValue).toBe(null)
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    })
  })
  
  describe('Multi select', () => {
    test('toggle', async () => {
      const wrapper = mountWidget({ cardinality: 'many' as const, options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })

      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    
      await wrapper.get('[data-test="toggle"]').trigger('click')
      expect(wrapper.props().modelValue.length).toBe(1)
      
      await wrapper.get('[data-test="toggle"]').trigger('click')
      expect(wrapper.props().modelValue.length).toBe(2)
      
      await wrapper.get('[data-test="toggle"]').trigger('click')
      expect(wrapper.props().modelValue.length).toBe(3)
      expect(wrapper.props().modelValue).toEqual(['Grey', 'Light grey', 'Dark grey'])
      
      await wrapper.get('[data-test="toggle"]').trigger('click')
      expect(wrapper.props().modelValue.length).toBe(2)
      expect(wrapper.props().modelValue).toEqual(['Light grey', 'Dark grey'])
    })

    test('clear', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' as const, options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })

      await wrapper.get('[data-test="clear"]').trigger('click')
      expect(wrapper.props().modelValue).toBe(null)
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    })
  })

  test('add', async () => {
    const wrapper = mountWidget({ options: useDataProvider(['Grey', 'Light grey']) })

    await wrapper.get('[data-test="other"]').setValue('Dark grey')
    expect(wrapper.get('[data-test="options.2"]').text()).toBe('Dark grey')
  })
  
  test('filter', async () => {
    const options = useDataProvider(['Grey', 'Light grey'])
    const wrapper = mountWidget({ options })

    await wrapper.get('[data-test="filter"]').setValue('Light')
    expect(wrapper.get('[data-test="options.0"]').text()).toBe('Light grey')
  })
})