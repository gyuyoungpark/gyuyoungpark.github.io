import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const pilotId = 'electron-fluid';
const marker = `data-column-seo="${pilotId}"`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function seoHead(metadata) {
  const meta = metadata.meta.map((tag) => {
    const key = tag.name
      ? `name="${escapeHtml(tag.name)}"`
      : `property="${escapeHtml(tag.property)}"`;
    return `<meta ${marker} ${key} content="${escapeHtml(tag.content)}" />`;
  });
  const links = metadata.links.map((tag) => {
    const language = tag.hreflang ? ` hreflang="${escapeHtml(tag.hreflang)}"` : '';
    return `<link ${marker} rel="${escapeHtml(tag.rel)}" href="${escapeHtml(tag.href)}"${language} />`;
  });
  const jsonLd = JSON.stringify(metadata.jsonLd)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return [...meta, ...links, `<script ${marker} type="application/ld+json">${jsonLd}</script>`].join('\n    ');
}

function pageHtml(markup, metadata) {
  const titlePattern = /<title\b[^>]*>[\s\S]*?<\/title>/i;
  const languagePattern = /(<html\b[^>]*\blang=)["'][^"']*["']/i;
  const rootPattern = /<div\s+id=["']root["']\s*>\s*<\/div>/i;
  if (!titlePattern.test(template) || !languagePattern.test(template)
    || !rootPattern.test(template) || !/<\/head>/i.test(template)) {
    throw new Error('The built HTML template must contain a title, HTML language, empty root, and head.');
  }
  return template
    .replace(titlePattern, () => `<title ${marker}>${escapeHtml(metadata.title)}</title>`)
    .replace(languagePattern, (_match, prefix) => `${prefix}"${escapeHtml(metadata.htmlLanguage)}"`)
    .replace(rootPattern, () => `<div id="root">${markup}</div>`)
    .replace(/<\/head>/i, () => `    ${seoHead(metadata)}\n  </head>`);
}

function outputPath(pathname) {
  const destination = resolve(dist, pathname.replace(/^\/+/, ''), 'index.html');
  const withinDist = relative(dist, destination);
  if (isAbsolute(withinDist) || withinDist === '..' || withinDist.startsWith(`..${sep}`)) {
    throw new Error(`Prerender path escapes the build output: ${pathname}`);
  }
  return destination;
}

const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  resolve: { alias: { '@': resolve(root, 'src') } },
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
});

try {
  const [appModule, configModule, columnsModule, metadataModule] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    server.ssrLoadModule('/src/data/columnSeo.ts'),
    server.ssrLoadModule('/src/data/columns/index.ts'),
    server.ssrLoadModule('/src/lib/columnSeo.ts'),
  ]);
  const { default: App } = appModule;
  const { columnSeo, SITE_ORIGIN } = configModule;
  const column = columnsModule.getColumnById(pilotId);
  const config = columnSeo[pilotId];
  if (!column || !config) throw new Error(`Missing SEO pilot column: ${pilotId}`);

  const canonicalUrls = [new URL('/', SITE_ORIGIN).href];
  for (const page of Object.values(config.pages)) {
    const metadata = metadataModule.columnSeoMetadata(column, page.language);
    if (!metadata || metadata.canonical !== new URL(page.path, SITE_ORIGIN).href) {
      throw new Error(`Missing or inconsistent SEO metadata for ${page.path}`);
    }
    const markup = renderToString(React.createElement(App, {
      initialLocation: { pathname: page.path, hash: '' },
    }));
    const destination = outputPath(page.path);
    await mkdir(resolve(destination, '..'), { recursive: true });
    await writeFile(destination, pageHtml(markup, metadata), 'utf8');
    canonicalUrls.push(metadata.canonical);
    console.log(`Prerendered ${page.path} (${page.language})`);
  }

  const urls = [...new Set(canonicalUrls)];
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')
    + '\n</urlset>\n';
  await writeFile(resolve(dist, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(resolve(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', SITE_ORIGIN).href}\n`, 'utf8');
  console.log(`Wrote sitemap.xml (${urls.length} URLs) and robots.txt`);
} finally {
  await server.close();
}
