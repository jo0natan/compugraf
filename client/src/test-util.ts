import { render, RenderOptions, RenderResult } from '@testing-library/vue'

import ElementPlus from 'element-plus'
import  BR from 'element-plus/lib/locale/lang/pt-br'

export const customRender = (
  ui: any, overrides?: Omit<RenderOptions, 'global'>): RenderResult => {
  return render(ui, {
    global: {
      plugins: [[ElementPlus, ...[{ locale:  BR }]]]
    },
    ...overrides
  })
}
export { defineComponent, ref, reactive, nextTick } from 'vue'
export * from '@testing-library/vue'
export { customRender as render }