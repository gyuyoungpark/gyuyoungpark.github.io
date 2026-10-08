import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const column = JSON.parse(await readFile(path.join(root, 'src/data/columns/electron-fluid.json'), 'utf8'));
const configServer = await createServer({ root, configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
let seo;
try {
  seo = await configServer.ssrLoadModule('/src/data/columnSeo.ts');
} finally {
  await configServer.close();
}
const origin = seo.SITE_ORIGIN;
const routes = Object.values(seo.columnSeo[column.id].pages).map((page) => ({
  ...page, pathname: page.path, articleTitle: page.language === 'en' ? column.titleEn : column.title,
}));

function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return named[entity.toLowerCase()] ?? match;
  });
}

function attributes(openingTag) {
  return Object.fromEntries([...openingTag.matchAll(/\s([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, name, doubleQuoted, singleQuoted]) => [name.toLowerCase(), decodeEntities(doubleQuoted ?? singleQuoted)]));
}

function tags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))]
    .map(([raw]) => ({ raw, attributes: attributes(raw) }));
}

function elements(html, tag) {
  return [...html.matchAll(new RegExp(`(<${tag}\\b[^>]*>)([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map(([, opening, inner]) => ({ attributes: attributes(opening), inner }));
}

function textContent(html) {
  return decodeEntities(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function proseSegments(text) {
  return text.replaceAll('**', '').split(/\\\([\s\S]*?\\\)/g)
    .map((segment) => segment.replace(/\s+/g, ' ').trim()).filter((segment) => segment.length >= 10);
}

function uniqueAttribute(tagsToSearch, key, value, attribute, message) {
  const matches = tagsToSearch.filter((tag) => tag.attributes[key] === value);
  assert.equal(matches.length, 1, `${message}: one ${key}=${value}`);
  return matches[0].attributes[attribute];
}

async function requireLocalAsset(url, pathname) {
  if (/^(?:https?:|data:|\/\/)/i.test(url)) return;
  const resolved = new URL(url, `${origin}${pathname}`);
  assert.equal(resolved.origin, origin, `asset remains on the site: ${url}`);
  const asset = path.resolve(dist, `.${decodeURIComponent(resolved.pathname)}`);
  assert.ok(asset.startsWith(`${dist}${path.sep}`), `asset stays inside dist: ${url}`);
  assert.ok((await stat(asset)).isFile(), `built local asset exists: ${url}`);
}

test('built electron-fluid pilot pages contain complete localized content and discovery metadata', async (t) => {
  const htmlByLanguage = new Map();
  for (const route of routes) {
    await t.test(`${route.language}: article is present before JavaScript runs`, async () => {
      const html = await readFile(path.join(dist, route.pathname, 'index.html'), 'utf8');
      htmlByLanguage.set(route.language, html);
      assert.equal(tags(html, 'html')[0]?.attributes.lang, route.language);
      const body = elements(html, 'body')[0]?.inner ?? '';
      const visibleBody = body.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
      const articles = elements(visibleBody, 'article');
      assert.equal(articles.length, 1, 'exactly one complete article, not homepage cards');
      const article = articles[0];
      assert.equal(article.attributes.lang, route.language, 'article declares its actual language');
      assert.equal(textContent(elements(article.inner, 'h1')[0]?.inner ?? ''), route.articleTitle);
      assert.ok(!article.inner.includes('The English version is coming soon'), 'no client-only fallback');

      const paragraphs = elements(article.inner, 'p').map((element) => textContent(element.inner));
      const headings = elements(article.inner, 'h2').map((element) => textContent(element.inner));
      const mathSource = elements(article.inner, 'annotation')
        .filter((element) => element.attributes.encoding === 'application/x-tex').map((element) => textContent(element.inner));
      for (const block of column.blocks) {
        if (block.type === 'paragraph') {
          const localized = route.language === 'en' ? block.textEn : block.text;
          assert.ok(localized, 'every paragraph has the requested translation');
          const segments = proseSegments(localized);
          assert.equal(paragraphs.filter((paragraph) => segments.every((segment) => paragraph.includes(segment))).length, 1,
            `${route.language}: complete paragraph is in initial HTML: ${segments[0]}`);
        } else if (block.type === 'heading') {
          assert.ok(headings.includes(route.language === 'en' ? block.textEn : block.text), 'localized section heading');
        } else if (block.type === 'equation') {
          assert.ok(mathSource.includes(block.text), 'display equation retains its source and rendered math');
        }
      }
      const otherFirstParagraph = column.blocks.find((block) => block.type === 'paragraph');
      const otherText = route.language === 'en' ? otherFirstParagraph.text : otherFirstParagraph.textEn;
      assert.ok(!textContent(article.inner).includes(proseSegments(otherText)[0]), 'the other language is not duplicated in the body');

      const figures = elements(article.inner, 'figure');
      const expectedFigures = column.blocks.filter((block) => block.type === 'figure');
      const expectedPaperFigures = column.blocks.filter((block) => block.type === 'paperFigure');
      assert.equal(expectedFigures.length, 5, 'pilot includes all five explanatory figures');
      assert.equal(expectedPaperFigures.length, 2, 'pilot includes both original paper figures');
      assert.equal(figures.filter((figure) => (figure.attributes.class ?? '').split(/\s+/).includes('column-figure')).length, 5);
      assert.equal(figures.filter((figure) => (figure.attributes.class ?? '').split(/\s+/).includes('column-paper-figure')).length, 2);
      assert.equal(figures.length, expectedFigures.length + expectedPaperFigures.length);
      for (const block of expectedFigures) {
        const label = `${route.language === 'en' ? 'Figure' : '그림'} ${block.number}.`;
        assert.equal(figures.filter((figure) => textContent(elements(figure.inner, 'p')[0]?.inner ?? '').startsWith(label)).length, 1,
          `each explanatory figure appears once: ${label}`);
      }
      for (const figure of figures) {
        const image = tags(figure.inner, 'img')[0];
        assert.ok(image?.attributes.src && image.attributes.alt, 'every figure has its image and alt text');
        const caption = textContent(elements(figure.inner, 'figcaption')[0]?.inner ?? '');
        assert.ok(caption, 'every figure retains a caption');
        if (route.language === 'ko') {
          assert.match(image.attributes.alt, /[가-힣]/, 'Korean figure alt text');
          assert.match(caption, /[가-힣]/, 'Korean figure caption');
        } else {
          assert.doesNotMatch(image.attributes.alt, /[가-힣]/, 'English figure alt text');
          assert.doesNotMatch(caption, /[가-힣]/, 'English figure caption');
        }
      }
      for (const block of expectedPaperFigures) {
        const figure = figures.find((candidate) => tags(candidate.inner, 'img')[0]?.attributes.src === block.image);
        assert.ok(figure, `original paper figure: ${block.image}`);
        const caption = route.language === 'en' ? block.captionEn : block.caption;
        assert.ok(textContent(figure.inner).includes(caption), 'complete localized paper-figure caption');
        assert.ok(tags(figure.inner, 'a').some((anchor) => anchor.attributes.href === block.sourceUrl), 'paper figure keeps its primary source');
      }
      assert.equal(column.references.length, 8, 'pilot retains all eight references');
      for (const reference of column.references) {
        const listItem = elements(article.inner, 'li').find((item) => item.attributes.id === `column-${column.id}-reference-${reference.id}`);
        assert.ok(listItem, `reference entry: ${reference.id}`);
        assert.ok(textContent(listItem.inner).includes(reference.title), 'reference title is in initial HTML');
        assert.ok(tags(listItem.inner, 'a').some((anchor) => anchor.attributes.href === `https://doi.org/${reference.doi}`), 'reference DOI is preserved');
      }
      for (const image of tags(html, 'img')) await requireLocalAsset(image.attributes.src, route.pathname);
      for (const script of tags(html, 'script')) if (script.attributes.src) await requireLocalAsset(script.attributes.src, route.pathname);
      for (const link of tags(html, 'link')) if (['stylesheet', 'modulepreload'].includes(link.attributes.rel)) await requireLocalAsset(link.attributes.href, route.pathname);
    });

    await t.test(`${route.language}: metadata, canonical and structured data agree with visible content`, () => {
      const html = htmlByLanguage.get(route.language);
      assert.ok(html, 'built page was read');
      const head = elements(html, 'head')[0]?.inner ?? '';
      const pageTitle = textContent(elements(head, 'title')[0]?.inner ?? '');
      assert.equal(pageTitle, route.title);
      const metas = tags(head, 'meta');
      const links = tags(head, 'link');
      const canonical = `${origin}${route.pathname}`;
      assert.equal(uniqueAttribute(metas, 'name', 'description', 'content', 'description'), route.description);
      assert.equal(uniqueAttribute(links, 'rel', 'canonical', 'href', 'canonical'), canonical);
      assert.equal(uniqueAttribute(metas, 'property', 'og:url', 'content', 'Open Graph URL'), canonical);
      assert.equal(uniqueAttribute(metas, 'property', 'og:title', 'content', 'Open Graph title'), pageTitle);
      assert.equal(uniqueAttribute(metas, 'property', 'og:description', 'content', 'Open Graph description'), route.description);
      assert.equal(uniqueAttribute(metas, 'property', 'og:locale', 'content', 'Open Graph locale'), route.ogLocale);
      for (const alternate of routes) {
        assert.equal(uniqueAttribute(links.filter((link) => link.attributes.rel === 'alternate'), 'hreflang', alternate.language, 'href', 'language alternate'),
          `${origin}${alternate.pathname}`);
      }
      const structuredScripts = elements(head, 'script').filter((script) => script.attributes.type === 'application/ld+json');
      assert.equal(structuredScripts.length, 1, 'one Article JSON-LD record');
      const article = JSON.parse(structuredScripts[0].inner);
      assert.equal(article['@context'], 'https://schema.org');
      assert.equal(article['@type'], 'Article');
      assert.equal(article.headline, route.articleTitle);
      assert.equal(article.description, route.description);
      assert.equal(article.inLanguage, route.language);
      assert.equal(article.datePublished, column.date);
      assert.equal(article.url, canonical);
      assert.equal(article.mainEntityOfPage?.['@id'] ?? article.mainEntityOfPage, canonical);
      assert.equal(article.author?.name, 'Gyuyoung Park');
      assert.equal(new URL(Array.isArray(article.image) ? article.image[0] : article.image).origin, origin);
      const languageAnchors = tags(html, 'a');
      for (const alternate of routes) assert.ok(languageAnchors.some((anchor) => anchor.attributes.href === alternate.pathname), 'both language versions have real navigable links');
    });
  }

  await t.test('only the electron-fluid pilot is prerendered and listed for discovery', async () => {
    const index = await readFile(path.join(dist, 'index.html'), 'utf8');
    assert.equal(elements(index, 'article').length, 0, 'homepage remains the existing app entry');
    assert.ok(!index.includes(proseSegments(column.blocks[0].textEn)[0]), 'homepage does not duplicate the full pilot article');
    assert.ok(!index.includes('"@type":"Article"'), 'homepage does not publish the pilot structured data');
    const pilotHtml = new Set(routes.map((route) => `${route.pathname.slice(1)}index.html`));
    for (const file of await readdir(dist, { recursive: true })) {
      const normalized = file.replaceAll('\\', '/');
      if (!normalized.endsWith('.html') || pilotHtml.has(normalized) || normalized === 'index.html') continue;
      const otherPage = await readFile(path.join(dist, file), 'utf8');
      assert.equal(elements(otherPage, 'article').length, 0, `other records stay outside this prerender pilot: ${normalized}`);
    }
    const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
    const locations = elements(sitemap, 'loc').map((element) => textContent(element.inner));
    assert.ok(!locations.some((url) => url.includes('#')), 'sitemap uses canonical real paths');
    const expected = routes.map((route) => `${origin}${route.pathname}`);
    assert.equal(locations.filter((url) => url === `${origin}/`).length, 1, 'homepage remains in the sitemap');
    for (const canonical of expected) assert.equal(locations.filter((url) => url === canonical).length, 1, 'each localized canonical appears once');
    assert.ok(locations.every((url) => url === `${origin}/` || expected.includes(url)), 'sitemap does not expand the pilot to other records');
    const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
    assert.match(robots, new RegExp(`^Sitemap:\\s*${origin.replaceAll('.', '\\.')}\\/sitemap\\.xml\\s*$`, 'm'));
    assert.ok(!/^Disallow:\s*\/(?:\s|$)/m.test(robots), 'robots allows crawling the pilot');
  });
});
