import { expect, test } from 'vitest'

test('export all utils', async () => {
  const index = await import('../../utils')
  expect(index).toHaveProperty('focusNextSibling')
  expect(index).toHaveProperty('focusPreviousSibling')
  expect(index).toHaveProperty('focusChild')
  expect(index).toHaveProperty('getRenewableTimeout')
  expect(index).toHaveProperty('registerLayout')
  expect(index).toHaveProperty('resolveLayout')
})