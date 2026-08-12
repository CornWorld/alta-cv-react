// Pages Function 中间件：隐藏所有 pages.dev 域
// - host 以 .cv-7mm.pages.dev 结尾：仅放行带 x-internal-secret 的代理内部请求，否则返回 404
// - 其它 host（如 cv.corn.im 生产自定义域）：透传（main 公开，/for/* 由代理函数处理）

export async function onRequest(context: {
  request: Request
  env: { INTERNAL_FETCH_SECRET?: string }
  next: () => Promise<Response>
}) {
  const url = new URL(context.request.url)
  const host = url.hostname

  if (host.endsWith('.cv-7mm.pages.dev')) {
    const secret = context.env.INTERNAL_FETCH_SECRET
    const header = context.request.headers.get('x-internal-secret')
    if (!secret || header !== secret) {
      return new Response('Not Found', { status: 404 })
    }
  }

  return context.next()
}
