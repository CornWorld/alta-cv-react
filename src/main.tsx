import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { applyA4Margin, getA4Margin } from './a4Margin'

type CVDebug = {
  a4: (on?: boolean) => boolean
  /** A4 页边距（CSS margin 简写，1/2/3/4 值）：无参读取，有参应用 */
  a4Margin: (margin?: string) => string
}

declare global {
  interface Window {
    CV?: CVDebug
  }
}

// A4 模式的内部设置与读取函数（统一出口）
function setA4(enable: boolean) {
  if (enable) {
    document.documentElement.setAttribute('data-a4', '1')
  } else {
    document.documentElement.removeAttribute('data-a4')
  }
}
function getA4(): boolean {
  return document.documentElement.getAttribute('data-a4') === '1'
}

// 启用 A4 屏幕模式：通过命令行环境变量 VITE_A4=1（保留向后兼容）
if (import.meta.env && import.meta.env.VITE_A4 === '1') {
  setA4(true)
}

// 应用 A4 页边距配置（VITE_A4_MARGIN 简写，1/2/3/4 值）：
// - 屏幕 A4 预览：写入 --a4-margin-* 变量
// - 打印：注入 @page { margin: ... }（@page 不解析 var()，必须字面量）
// 无论 A4 模式是否开启都调用，保证打印始终使用配置的页边距。
if (typeof document !== 'undefined') {
  applyA4Margin()
}

// 暴露控制台调试 API：window.CV.a4(on?)、window.CV.a4Margin(shorthand?)
const cvImpl: CVDebug = {
  a4: (on?: boolean) => {
    if (typeof on === 'boolean') {
      setA4(on)
      return getA4()
    }
    setA4(!getA4())
    return getA4()
  },
  a4Margin: (margin?: string) =>
    margin ? applyA4Margin(margin) : getA4Margin(),
}

window.CV = { ...(window.CV ?? {} as CVDebug), ...cvImpl }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
