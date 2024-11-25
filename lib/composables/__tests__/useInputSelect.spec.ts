import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { useInputSelect } from "../useInputSelect"
import type { InputSelectOptions } from "../useInputSelect"
import type { Option } from "../useInputOptionsProvider"

type SelectOption = Option<{ cid: string, uid: string, name: string }>
const SelectOne = (options?: Partial<InputSelectOptions>) => defineComponent({
  props: {
    modelValue: {
      type: String,
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
    return useInputSelect(props, emit, options)
  },
  template: `
    <select v-model="value" data-test="input">
      <option v-for="[option, label] in provider.options.value" :key="option" :value="option" :data-test="option">{{ label }}</option>
    </select>
    <button @click="select(provider.options.value[1][0])" data-test="select">Select</button>
    <button @click="unselect(provider.options.value[1][0])" data-test="unselect">Select</button>
  `
})

const SelectMany = (options?: Partial<Omit<InputSelectOptions<"many">, "cardinality">>) => defineComponent({
  props: {
    modelValue: {
      type: Array<string>,
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
    return useInputSelect(props, emit, { ...options, cardinality: "many" })
  },
  template: `
    <select v-model="value" multiple data-test="input">
      <option v-for="[option, label] in provider.options.value.slice(1)" :key="option" :value="option" :data-test="option">{{ label }}</option>
    </select>
    <button @click="select(provider.options.value.slice(1)[0][0])" data-test="select">Select</button>
    <button @click="toggle(provider.options.value.slice(1)[0][0])" data-test="toggle">Toggle</button>
    <button @click="unselect(provider.options.value.slice(1)[0][0])" data-test="unselect">Unselect</button>
  `
})

describe("useInputSelect", () => {
  const options: SelectOption[] = [["", "- Select -"], "grey", ["dark-grey", "Dark grey"], { cid: "light-grey", uid: "rt56jk", name: "Light grey" }]
  
  test("Options", async () => {
    const wrapper = mount(SelectOne(), { props: { options }})
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.element.value)).toEqual([options[0][0], options[1], options[2][0], options[3]["cid"]])
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.text())).toEqual([options[0][1], options[1], options[2][1], options[3]["cid"]])

    await wrapper.setProps({ id: "uid", label: "name" })
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.element.value)).toEqual([options[0][0], options[1], options[2][0], options[3]["uid"]])
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.text())).toEqual([options[0][1], options[1], options[2][1], options[3]["name"]])

    await wrapper.setProps({ id: ({ uid }) => uid, label: ({ name }) => name })
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.element.value)).toEqual([options[0][0], options[1], options[2][0], options[3]["uid"]])
    expect(wrapper.get('[data-test="input"]').findAll("option").map(opt => opt.text())).toEqual([options[0][1], options[1], options[2][1], options[3]["name"]])
  })

  describe("Set", () => {
    test("Single-value", async () => {
      const wrapper = mount(SelectOne(), { props: { options }})
      
      await wrapper.get('[data-test="input"]').setValue("dark-grey")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([["dark-grey"]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[["dark-grey", "Dark grey"], ["", "- Select -"]]])
    })

    test("Multi-value", async () => {
      const wrapper = mount(SelectMany(), { props: { options }})
      
      await wrapper.get('[data-test="input"]').setValue(["dark-grey", "grey"])
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([[["grey", "dark-grey"]]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[[["grey", "grey"], ["dark-grey", "Dark grey"]], [], [["grey", "grey"], ["dark-grey", "Dark grey"]]]])
    })
  })

  describe("Select", () => {
    test("Single-value", async () => {
      const wrapper = mount(SelectOne(), { props: { options }})
      
      await wrapper.get('[data-test="select"]').trigger("click")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([["grey"]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[["grey", "grey"], ["", "- Select -"]]])
    })

    test("Multi-value", async () => {
      const wrapper = mount(SelectMany(), { props: { modelValue: ["dark-grey"], options }})
      
      await wrapper.get('[data-test="select"]').trigger("click")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([[["grey", "dark-grey"]]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[[["grey", "grey"]], [], [["grey", "grey"], ["dark-grey", "Dark grey"]]]])
    })
  })

  describe("Toggle", () => {
    test("Multi-value", async () => {
      const wrapper = mount(SelectMany(), { props: { options }})
      
      await wrapper.get('[data-test="toggle"]').trigger("click")
      await wrapper.get('[data-test="toggle"]').trigger("click")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([[["grey"]], [[]]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[[["grey", "grey"]], [], [["grey", "grey"]]], [[], [["grey", "grey"]], []]])
    })
  })

  describe("Unselect", () => {
    test("Single-value", async () => {
      const wrapper = mount(SelectOne(), { props: { modelValue: "grey", options }})
      
      await wrapper.get('[data-test="unselect"]').trigger("click")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([[""]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[["", "- Select -"], ["grey", "grey"]]])
    })

    test("Multi-value", async () => {
      const wrapper = mount(SelectMany(), { props: { modelValue: ["grey", "dark-grey"], options }})
      
      await wrapper.get('[data-test="unselect"]').trigger("click")
      
      expect(wrapper.emitted()).toHaveProperty("update:modelValue")
      expect(wrapper.emitted("update:modelValue")).toEqual([[["dark-grey"]]])
      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([[[], [["grey", "grey"]], [["dark-grey", "Dark grey"]]]])
    })
  })
})
