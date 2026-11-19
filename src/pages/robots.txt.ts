import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
  const sitemaps = process.env.PUBLISH_TARGET === 'github-pages'
    ? ['thrift-to-json-schema', 'text-search-engine', 'morse'].map(
      (project) => `https://cjinhuo.github.io/${project}/sitemap.xml`
    )
    : ['https://cjinhuo.netlify.app/sitemap-index.xml']

  return new Response(['User-agent: *', 'Allow: /', '', ...sitemaps.map((url) => `Sitemap: ${url}`), ''].join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
