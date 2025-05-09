import { expect, test } from 'vitest'

test('export all components', async () => {
  const index = await import('../index')
  expect(index).toHaveProperty('Stylable')
  expect(index).toHaveProperty('WidgetNumber')
  expect(index).toHaveProperty('WidgetText')
})