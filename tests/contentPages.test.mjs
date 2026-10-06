import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

test('content detail pages render from the actual app', async (t) => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const previousWindow = globalThis.window;
  const server = await createServer({
    root, configFile: false,
    plugins: [
      { name: 'omit-browser-portal-in-server-test', enforce: 'pre', load(id) {
        if (id.replaceAll('\\', '/').endsWith('/src/components/EdgeNavigation.tsx')) {
          return 'export function EdgeNavigation() { return null; }';
        }
      } },
      react(),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
    server: { middlewareMode: true, hmr: false },
  });
  try {
    globalThis.window = { location: { hash: '#top' }, history: { state: null } };
    const { default: App } = await server.ssrLoadModule('/src/App.tsx');
    const { articles, activities, achievements } = await server.ssrLoadModule('/src/data/content.ts');
    const { columns } = await server.ssrLoadModule('/src/data/columns/index.ts');
    function render(hash, keywordSelection = []) {
      window.location.hash = hash;
      window.history.state = { keywordSelection };
      return renderToStaticMarkup(React.createElement(App));
    }

    await t.test('every homepage card points to its internal detail page', () => {
      const html = render('#top');
      for (const [section, items] of [['research', articles], ['activities', activities], ['columns', columns], ['achievements', achievements]]) {
        for (const item of items) assert.ok(html.includes(`href="/#/${section}/${encodeURIComponent(item.id)}"`));
      }
      const cards = html.match(/<article\b[\s\S]*?<\/article>/g);
      assert.equal(cards.length, articles.length + activities.length + columns.length + achievements.length);
      for (const card of cards) assert.ok(!card.includes('target="_blank"'), 'card clicks stay on the site');
    });

    await t.test('all research and activity routes show their recorded sources and return links', () => {
      for (const [section, items] of [['research', articles], ['activities', activities]]) {
        for (const item of items) {
          const html = render(`#/${section}/${encodeURIComponent(item.id)}`);
          assert.match(html, /<h1\b/);
          assert.ok(html.includes(item.title), item.id);
          assert.ok(html.includes(`href="/#${section}"`), `return link: ${item.id}`);
          const source = item.doi ? `https://doi.org/${item.doi}` : item.url;
          assert.ok(html.includes(`href="${source.replaceAll('&', '&amp;')}" target="_blank"`), `external source: ${item.id}`);
          if (item.image) assert.ok(html.includes(`src="${item.image}"`), `image: ${item.id}`);
          assert.ok(!html.includes('id="keywords"'), 'detail pages replace the index');
        }
      }
      for (const column of columns) assert.ok(render(`#/columns/${column.id}`).includes(column.titleEn));
    });

    await t.test('CV achievements show all recorded periods and open their own pages', () => {
      const html = render('#achievements');
      assert.ok(html.indexOf('id="achievements"') > html.indexOf('id="activities"'));
      for (const achievement of achievements) {
        const detail = render(`#/achievements/${achievement.id}`);
        assert.ok(detail.includes(achievement.title.replaceAll('&', '&amp;')));
        assert.ok(detail.includes(achievement.dateLabel.replaceAll('&', '&amp;')));
        if (achievement.organization) assert.ok(detail.includes(achievement.organization));
        assert.ok(detail.includes('href="/#achievements"'));
        assert.ok(!detail.includes('DOI:'), 'awards do not invent DOI links');
      }
    });

    await t.test('section return routes retain the selected OR filter', () => {
      const html = render('#research', ['chaos', 'graphene']);
      assert.equal((html.match(/<article\b/g) ?? []).length, 9);
      assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 2);
      assert.ok(html.includes('9 matching items'));
      const detail = render('#/research/moire-chaos-2026', ['chaos', 'graphene']);
      assert.ok(detail.includes('DOI: 10.48550/arXiv.2608.13062'));
    });

    await t.test('an unknown item gives a way back to the homepage', () => {
      const html = render('#/research/does-not-exist');
      assert.ok(html.includes('Page not found'));
      assert.ok(html.includes('href="/#top"'));
    });
  } finally {
    await server.close();
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
