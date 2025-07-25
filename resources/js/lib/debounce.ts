export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 500) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}
