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
  emits: ['toggle', 'select', 'unselect', 'add', 'filter', 'clear', 'validate'],
  setup(props, { emit }) {
    return {
      onToggle(index: number[]) {
        emit('toggle', ...index.map(i => props.options[i]))
      },
      onSelect(index: number[]) {
        emit('select', ...index.map(i => props.options[i]))
      },
      onUnselect(index: number[]) {
        emit('unselect', ...index.map(i => props.options[i]))
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
      <input data-test="toggle" @input.stop="onToggle($event.target.value.split(',').map(Number))" />
      <input data-test="select" @input.stop="onSelect($event.target.value.split(',').map(Number))" />
      <input data-test="unselect" @input.stop="onUnselect($event.target.value.split(',').map(Number))" />
      <input data-test="other" @input.stop="onAdd($event.target.value)" />
      <input data-test="filter" @input.stop="onFilter($event.target.value)" />
      <button data-test="clear" @click="onClear" />
      <button data-test="validate" @click="onValidate" />
      <div data-test="error">{{ error }}</div>
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
    
      await wrapper.get('[data-test="toggle"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value.0"]').text()).toBe('Grey')
      
      await wrapper.get('[data-test="toggle"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('')
      expect(wrapper.find('[data-test="value.0"]').exists()).toBe(false)
    })
    
    test('select', async () => {
      const wrapper = mountWidget({ options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
      
      await wrapper.get('[data-test="select"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value.0"]').text()).toBe('Grey')
      
      await wrapper.get('[data-test="select"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value.0"]').text()).toBe('Grey')
    })
    
    test('unselect', async () => {
      const wrapper = mountWidget({ modelValue: 'Grey', options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="unselect"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('')
    })

    test('clear', async () => {
      const wrapper = mountWidget({ modelValue: 'Grey', options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="clear"]').trigger('click')
      expect(wrapper.props().modelValue).toBe(null)
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    })

    test('validate', async () => {
      const wrapper = mountWidget({ options: useDataProvider(['Grey', 'Light grey']), min: 1, max: 1 })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
    })
  })
  
  describe('Multi select', () => {
    test('toggle', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' as const, options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="toggle"]').setValue('1,2')
      expect(wrapper.props().modelValue).toEqual(['Grey', 'Dark grey'])
    })

    test('select', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many', options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="select"]').setValue('1,2')
      expect(wrapper.props().modelValue).toEqual(['Grey', 'Light grey', 'Dark grey'])
    })
    
    test('unselect', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many', options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="unselect"]').setValue('0,1')
      expect(wrapper.props().modelValue).toEqual([])
    })

    test('clear', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' as const, options: useDataProvider(['Grey', 'Light grey', 'Dark grey']) })
      await wrapper.get('[data-test="clear"]').trigger('click')
      expect(wrapper.props().modelValue).toBe(null)
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
    })

    test('validate', async () => {
      const wrapper = mountWidget({ cardinality: 'many', options: useDataProvider(['Grey', 'Light grey']), min: 1, max: 1 })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
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