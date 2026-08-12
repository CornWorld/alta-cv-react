// Pages Function: for 分支隐私代理
// 把 cv.corn.im/for/{id}/... 代理到 for 分支最新构建 https://for-{id}.cv-7mm.pages.dev/...
// - {id} 对应 git 分支 for/{id}（小写字母/数字/连字符）
// - fetch 时携带内部头 x-internal-secret（= env.INTERNAL_FETCH_SECRET），
//   让 _middleware 放行内部拉取；浏览器直连 pages.dev 域名一律 404
// - 对 HTML 注入 <base href="/for/{id}/">，让 Vite 相对路径资源在嵌套代理路径下正确解析
// - 目标不存在时返回干净 404，不透传 Cloudflare 错误页

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function onRequest({ request, params, env }: {
  request: Request
  params: { id: string; path?: string[] }
  env: { INTERNAL_FETCH_SECRET?: string }
}) {
  const { id } = params
  const idNormalized = id.toLowerCase()
  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)

  // 1. 拒绝非法 id：返回干净 404
  if (!ID_RE.test(idNormalized)) {
    return new Response('Not Found', { status: 404 })
  }

  // 2. 仅对根请求（无路径段）规范化尾斜杠：/for/{id} → /for/{id}/
  //    资产请求（/for/{id}/assets/x.js）保持原样透传，避免 JS/CSS 被误重定向
  if (path === '' && !url.pathname.endsWith('/')) {
    return new Response(null, {
      status: 301,
      headers: { Location: `${url.pathname}/${url.search}`, 'cache-control': 'no-store' },
    })
  }

  // 3. 代理到 for 分支别名（内部上游）
  const target = `https://for-${idNormalized}.cv-7mm.pages.dev/${path}${url.search}`
  const fetchHeaders = new Headers()
  if (env.INTERNAL_FETCH_SECRET) {
    fetchHeaders.set('x-internal-secret', env.INTERNAL_FETCH_SECRET)
  }
  const response = await fetch(target, { headers: fetchHeaders })

  // 4. 目标不存在（404/5xx）：返回干净 404，不透传 CF 错误页
  if (!response.ok) {
    return new Response('Not Found', { status: response.status })
  }

  const contentType = response.headers.get('content-type') ?? ''

  // 5. 仅对 HTML 重写：注入 <base>，让相对资源路径解析到 /for/{id}/
  if (contentType.includes('text/html')) {
    const html = await response.text()
    const prefix = `/for/${idNormalized}/`
    const rewritten = html.replace(/<head([^>]*)>/i, `<head$1><base href="${prefix}">`)

    const resHeaders = Object.fromEntries(response.headers)
    // 剥离压缩/长度头：response.text() 已解压，残留会损坏响应
    delete resHeaders['content-encoding']
    delete resHeaders['content-length']
    delete resHeaders['transfer-encoding']
    resHeaders['content-type'] = contentType
    resHeaders['cache-control'] = 'no-store'
    resHeaders['x-robots-tag'] = 'noindex' // 分享链接不让搜索引擎收录

    return new Response(rewritten, { status: response.status, headers: resHeaders })
  }

  // 6. 非 HTML 原样透传（其 URL 已是 /for/{id}/ 下的绝对路径，无需重写）
  return response
}
