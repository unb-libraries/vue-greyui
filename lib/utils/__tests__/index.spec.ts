import { expect, test } from 'vitest'

test('export all utils', async () => {
  const index = await import('../index')
  expect(index).toHaveProperty('focusNextSibling')
  expect(index).toHaveProperty('focusPreviousSibling')
  expect(index).toHaveProperty('focusChild')
  expect(index).toHaveProperty('getRenewableTimeout')
})