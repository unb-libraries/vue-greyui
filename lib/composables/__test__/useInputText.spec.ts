import { useInputText } from ".."
import { describe, expect, test, vi } from "vitest"

describe('useInputText', () => {
  const props = { modelValue: undefined }
  const emits = vi.fn((evt: string, value: string) => {})
  const { value, update, onInput, clear } = useInputText(props, emits)

  test('assigning "test" should emit "test"', () => {
    value.value = 'test'
    expect(emits).toHaveBeenCalledWith('update:modelValue', 'test')
  })
  
  test('update("another test") should emit "another test"', () => {
    update('another test')
    expect(emits).toHaveBeenCalledWith('update:modelValue', 'another test')
  })
  
  test('clear() should emit an empty value', () => {
    clear()
    expect(emits).toHaveBeenCalledWith('update:modelValue', undefined)
  })

  test("onInput(event) should emit the event target's value", () => {
    onInput({ target: { value: 'new value' } } as unknown as Event)
    expect(emits).toHaveBeenCalledWith('update:modelValue', 'new value')
  })
})

