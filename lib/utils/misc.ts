export function getRenewableTimeout(fn: () => void, delay?: number) {
  let timeout: NodeJS.Timeout
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, delay ?? 0)
  }
}