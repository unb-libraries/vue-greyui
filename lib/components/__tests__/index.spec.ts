import { expect, test } from 'vitest'

test('export all components', async () => {
  const index = await import('../index')
  expect(index).toHaveProperty('Stylable')
  // expect(index).toHaveProperty('Widget')
  expect(index).toHaveProperty('Modal')
  expect(index).toHaveProperty('WidgetNumber')
  expect(index).toHaveProperty('WidgetOptions')
  expect(index).toHaveProperty('WidgetText')
  expect(index).toHaveProperty('WidgetToggle')
})