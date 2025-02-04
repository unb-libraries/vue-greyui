import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { useInputSelect } from "../useInputSelect"
import type { Cardinality } from ".."
import type { InputSelectOptions } from "../useInputSelect"
import type { Option } from "../useInputOptionsProvider"

type SelectOption = Option<{ cid: string, uid: string, name: string }>
const Select = (options?: Partial<InputSelectOptions<Cardinality>>) => defineComponent({
  props: {
    modelValue: {
      type: [String, Array<string>],
      required: false,
      default: undefined,
    },
    options: {
      type: Array<SelectOption>,
      required: true,
    },
    id: {
      type: [String, Function],
      required: false,
      default: undefined,
    },
    label: {
      type: [String, Function],
      required: false,
      default: undefined,
    }
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    // @ts-expect-error - Ignore type error
    return useInputSelect(props, emit, { cardinality: options?.cardinality, emptyValue: options?.emptyValue })
  },
  template: `
    <div v-for="[option, label] in provider.options.value" :key="option">
      <input type="checkbox" :value="option" :data-test="option" @change="toggle(option)" />
      <label>{{ label }}</label>
    </div>
  `
})

describe("useInputSelect", () => {
  const options: SelectOption[] = ["grey", ["dark-grey", "Dark grey"], { cid: "light-grey", uid: "rt56jk", name: "Light grey" }]
  
  test("Options", async () => {
    const wrapper = mount(Select(), { props: { options }})

    expect(wrapper.findAll('[type="checkbox"]').map(opt => (opt.element as HTMLInputElement).value)).toEqual([options[0], options[1][0], options[2]["cid"]])
    expect(wrapper.findAll('label').map(opt => opt.text())).toEqual([options[0], options[1][1], options[2]["cid"]])

    await wrapper.setProps({ id: "uid", label: "name" })
    expect(wrapper.findAll('[type="checkbox"]').map(opt => (opt.element as HTMLInputElement).value)).toEqual([options[0], options[1][0], options[2]["uid"]])
    expect(wrapper.findAll('label').map(opt => opt.text())).toEqual([options[0], options[1][1], options[2]["name"]])

    await wrapper.setProps({ id: ({ uid }) => uid, label: ({ name }) => name })
    expect(wrapper.findAll('[type="checkbox"]').map(opt => (opt.element as HTMLInputElement).value)).toEqual([options[0], options[1][0], options[2]["uid"]])
    expect(wrapper.findAll('label').map(opt => opt.text())).toEqual([options[0], options[1][1], options[2]["name"]])
  })

  describe("Select", () => {
    test("Single-value", async () => {
      const wrapper = mount(Select(), { props: { options, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }, attachTo: document.body })
      
      await wrapper.get('[data-test="dark-grey"]').trigger("click")
      expect(wrapper.props("modelValue")).toEqual("dark-grey")
      await wrapper.get('[data-test="dark-grey"]').trigger("click")
      expect(wrapper.props("modelValue")).toBeUndefined()
      
      expect(wrapper.emitted()).toHaveProperty("select")
      console.log(wrapper.emitted("select"))
      expect(wrapper.emitted("select")).toEqual([
        [["dark-grey", "Dark grey"], undefined],
        [undefined, ["dark-grey", "Dark grey"]],
      ])
    })

    test("Multi-value", async () => {
      const wrapper = mount(Select({ cardinality: "many", emptyValue: [] }), { props: { options, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }, attachTo: document.body })
      
      await wrapper.get('[data-test="grey"]').trigger("click")
      expect(wrapper.props("modelValue")).toEqual(["grey"])
      await wrapper.get('[data-test="dark-grey"]').trigger("click")
      expect(wrapper.props("modelValue")).toEqual(["grey", "dark-grey"])
      await wrapper.get('[data-test="grey"]').trigger("click")
      expect(wrapper.props("modelValue")).toEqual(["dark-grey"])
      
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([
        [[["grey", "grey"]], [], [["grey", "grey"]]],
        [[["dark-grey", "Dark grey"]], [], [["grey", "grey"], ["dark-grey", "Dark grey"]]],
        [[], [["grey", "grey"]], [["dark-grey", "Dark grey"]]],
      ])
    })
  })
})
