import { nextTick } from 'vue'

/**
 * get labe value from a list
 * @param list
 * @param value
 * @returns {string}
 */
export function getLabel(
  list?: {
    label: string
    value: string | number
  }[],
  value?: string | number
): string {
  const found = list?.find((item) => item.value === value)
  if (found) return found.label
  return ''
}

/**
 * @param data
 * @returns {any}
 */
export function deepClone(data: object) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * in order to test transitions, we need to use
 * await rAF() after firing transition events.
 */
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null)
        await nextTick()
      })
    })
  })
}