import { expect, test } from 'vitest'

test('export all components', async () => {
  const index = await import('../../components')
  expect(index).toHaveProperty('Collection')
  expect(index).toHaveProperty('Stylable')
  expect(index).toHaveProperty('Modal')
  expect(index).toHaveProperty('WidgetNumber')
  expect(index).toHaveProperty('WidgetOptions')
  expect(index).toHaveProperty('WidgetText')
  expect(index).toHaveProperty('WidgetToggle')
})