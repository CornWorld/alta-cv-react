export async function onRequest({ request, params }: {
  request: Request
  params: { hash: string; path?: string[] }
}) {
  const { hash } = params
  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)

  // proxy to deployment hash url on pages.dev
  const target = `https://${hash}.cv-7mm.pages.dev/${path}${url.search}`

  const response = await fetch(target)
  return response
}
