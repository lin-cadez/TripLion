import { getCollection } from 'astro:content';
import { seoPages } from '../data/seoPages';

const site = 'https://trip-lion.com';

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/features/', priority: '0.8' },
  { path: '/blog/', priority: '0.8' },
  { path: '/contact/', priority: '0.5' },
  { path: '/q-and-a/', priority: '0.5' },
  { path: '/privacy/', priority: '0.3' },
  { path: '/terms/', priority: '0.3' },
  ...seoPages.map((page) => ({ path: `/${page.slug}/`, priority: '0.8' })),
];

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  priority: string;
};

export async function GET() {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => a.slug.localeCompare(b.slug));

  const urls: SitemapUrl[] = [
    ...staticPages.map((page) => ({
      loc: `${site}${page.path}`,
      priority: page.priority,
    })),
    ...sortedPosts.map((post) => ({
      loc: `${site}/blog/${post.slug}/`,
      lastmod: formatDate(post.data.updatedDate ?? post.data.pubDate),
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
