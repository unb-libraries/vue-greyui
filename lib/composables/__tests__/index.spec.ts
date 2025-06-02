import { expect, test } from 'vitest'

test('export all composables except useInput', async () => {
  const index = await import('../index')
  expect(index).toHaveProperty('useDataProvider')
  expect(index).toHaveProperty('useInputAttrs')
})