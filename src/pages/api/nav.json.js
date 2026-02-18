import { getChannelInfo } from '../../lib/telegram'

function getFirstLine(text = '') {
  return `${text}`
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)[0] || ''
}

export async function GET(Astro) {
  const before = Astro.url.searchParams.get('before') || ''
  const after = Astro.url.searchParams.get('after') || ''
  const q = Astro.url.searchParams.get('q') || ''
  const limit = Math.max(1, Math.min(50, Number.parseInt(Astro.url.searchParams.get('limit') || '20', 10) || 20))

  const channel = await getChannelInfo(Astro, {
    before,
    after,
    q,
  })

  const posts = (channel?.posts || [])
    .filter(p => p?.id)
    .slice(0, limit)
    .map(p => ({
      id: `${p.id}`,
      label: getFirstLine(p.text) || p.title || `#${p.id}`,
    }))

  return Response.json({
    posts,
  }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
