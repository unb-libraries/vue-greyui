import { expect, test } from "vitest"

test('export all composables except useInput', async () => {
  const index = await import('../index')
  expect(index).toHaveProperty('useInputAttrs')
  expect(index).toHaveProperty('useInputText')
  expect(index).toHaveProperty('useInputNumber')
  expect(index).toHaveProperty('useInputValidation')
})