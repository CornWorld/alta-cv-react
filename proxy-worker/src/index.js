export default {
  async fetch(request) {
    const url = new URL(request.url)
    const hostname = url.hostname
    const subdomain = hostname.split('.')[0]

    // Proxy to branch.cv-7mm.pages.dev
    const target = `https://${subdomain}.cv-7mm.pages.dev${url.pathname}${url.search}`
    return fetch(new Request(target, request))
  }
}
