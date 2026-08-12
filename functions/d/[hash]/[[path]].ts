// Pages Function: 隐私代理
// 把 /d/{hash}/... 代理到对应的部署 https://{hash}.cv-7mm.pages.dev/...
//
// 关键点：
// - 校验 hash 为十六进制，避免把任意段当 hash 转发到不存在的主机（会显示 CF 错误页）。
// - 仅对「无路径段的根请求」规范化尾斜杠：/d/{hash} → /d/{hash}/；资产请求
//   （/d/{hash}/assets/x.js）保持原样透传。
// - 对 HTML 注入 <base href="/d/{hash}/">，让 Vite 的相对路径资源（./assets/...、
//   ./images/...、./alta-icon.svg）在嵌套代理路径下也能正确解析。
// - 目标不存在时返回干净 404，不透传 Cloudflare 错误页。

const HASH_RE = /^[0-9a-f]{6,32}$/i

export async function onRequest({ request, params }: {
  request: Request
  params: { hash: string; path?: string[] }
}) {
  const { hash } = params
  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)

  // 1. 拒绝非法 hash：返回干净 404
  if (!HASH_RE.test(hash)) {
    return new Response('Not Found', { status: 404 })
  }

  // 2. 仅对根请求（无路径段）规范化尾斜杠：/d/{hash} → /d/{hash}/
  if (path === '' && !url.pathname.endsWith('/')) {
    return new Response(null, {
      status: 301,
      headers: { Location: `${url.pathname}/${url.search}`, 'cache-control': 'no-store' },
    })
  }

  // 3. 代理到目标部署
  const target = `https://${hash}.cv-7mm.pages.dev/${path}${url.search}`
  const response = await fetch(target)

  // 4. 目标不存在（404/5xx）：返回干净 404，不透传 CF 错误页
  if (!response.ok) {
    return new Response('Not Found', { status: response.status })
  }

  const contentType = response.headers.get('content-type') ?? ''

  // 5. 仅对 HTML 重写：注入 <base>，让相对资源路径解析到 /d/{hash}/
  if (contentType.includes('text/html')) {
    const html = await response.text()
    const prefix = `/d/${hash}/`
    const rewritten = html.replace(/<head([^>]*)>/i, `<head$1><base href="${prefix}">`)

    const headers = Object.fromEntries(response.headers)
    // 剥离压缩/长度头：response.text() 已解压，残留会损坏响应
    delete headers['content-encoding']
    delete headers['content-length']
    delete headers['transfer-encoding']
    headers['content-type'] = contentType
    headers['cache-control'] = 'no-store'

    return new Response(rewritten, { status: response.status, headers })
  }

  // 6. 非 HTML 原样透传（其 URL 已是 /d/{hash}/ 下的绝对路径，无需重写）
  return response
}
