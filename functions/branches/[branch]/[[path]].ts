export async function onRequest({ request, params }: {
  request: Request
  params: { branch: string; path?: string[] }
}) {
  const { branch } = params
  const path = params.path ? params.path.join('/') : ''
  const url = new URL(request.url)

  // proxy to branch preview on pages.dev
  const target = `https://${branch}.cv-7mm.pages.dev/${path}${url.search}`

  const response = await fetch(target)
  return response
}
