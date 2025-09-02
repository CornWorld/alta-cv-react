import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

type CVDebug = {
  a4: (on?: boolean) => boolean
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

// 暴露控制台调试 API：window.CV.a4(on?)
const cvImpl: CVDebug = {
  a4: (on?: boolean) => {
    if (typeof on === 'boolean') {
      setA4(on)
      return getA4()
    }
    setA4(!getA4())
    return getA4()
  },
}

window.CV = { ...(window.CV ?? {} as CVDebug), ...cvImpl }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
