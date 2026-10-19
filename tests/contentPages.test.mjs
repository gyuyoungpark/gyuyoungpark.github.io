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
    const { formatDetailDate } = await server.ssrLoadModule('/src/lib/detailDate.ts');
    const { contentHref } = await server.ssrLoadModule('/src/lib/contentRoutes.ts');
    function render(hash, keywordSelection = [], pathname = '/') {
      window.location.hash = hash;
      window.history.state = { keywordSelection };
      return renderToStaticMarkup(React.createElement(App, { initialLocation: { pathname, hash } }));
    }

    await t.test('every homepage card points to its internal detail page', () => {
      const html = render('#top');
      for (const [section, items] of [['research', articles], ['activities', activities], ['columns', columns], ['achievements', achievements]]) {
        for (const item of items) assert.ok(html.includes(`href="${contentHref(section, item.id)}"`));
      }
      const cards = html.match(/<article\b[\s\S]*?<\/article>/g);
      assert.equal(cards.length, articles.length + activities.length + columns.length + achievements.length);
      for (const card of cards) assert.ok(!card.includes('target="_blank"'), 'card clicks stay on the site');
    });

    await t.test('the body VAGUE link opens a separate magazine while top navigation keeps its section anchor', () => {
      const homepage = render('#columns');
      assert.match(homepage, /<a\b[^>]*href="\/vague\/"[^>]*aria-label="Open VAGUE magazine"/);
      assert.ok(homepage.includes('href="/#columns"'), 'top navigation keeps its original destination');
      const magazine = render('', [], '/vague/');
      assert.ok(!magazine.includes('id="research"'), 'magazine is separate from the portfolio index');
      assert.ok(!magazine.includes('id="activities"'), 'magazine does not duplicate seminars');
      assert.ok(!magazine.includes('<article'), 'the interactive home has no story content');
      for (const column of columns) assert.ok(!magazine.includes(`href="${contentHref('columns', column.id)}"`), 'the interactive home has no article links');
      assert.ok(!magazine.includes('aria-label="Animation controls"'), 'home omits the removed playback controls');
    });

    await t.test('research and activity details keep DOI and return links without generic source links', () => {
      for (const [section, items] of [['research', articles], ['activities', activities]]) {
        for (const item of items) {
          const html = render(`#/${section}/${encodeURIComponent(item.id)}`);
          assert.match(html, /<h1\b/);
          assert.ok(html.includes(item.title), item.id);
          assert.ok(html.includes(`href="/#${section}"`), `return link: ${item.id}`);
          if (item.doi) assert.ok(html.includes(`href="https://doi.org/${item.doi}" target="_blank"`), `DOI: ${item.id}`);
          assert.ok(!html.includes('Official source'), `${item.id}: no generic official source link`);
          assert.ok(!html.includes(' · Source'), `${item.id}: no generic image source link`);
          const image = section === 'activities' ? item.detailImage?.src : item.image;
          if (image) assert.ok(html.includes(`src="${image}"`), `image: ${item.id}`);
          const articleHtml = html.match(/<article\b[\s\S]*?<\/article>/)[0];
          for (const anchor of articleHtml.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)) {
            assert.ok(!/<img\b/.test(anchor[0]), `${item.id}: detail images do not open links`);
          }
          assert.ok(!html.includes('View full image'), `${item.id}: no full-image action`);
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

    await t.test('every detail page has matching arrow return links above and below its content', () => {
      for (const [section, items] of [['research', articles], ['activities', activities], ['columns', columns], ['achievements', achievements]]) {
        for (const item of items) {
          const html = render(`#/${section}/${encodeURIComponent(item.id)}`).match(/<article\b[\s\S]*?<\/article>/)[0];
          const returnHref = section === 'columns' ? '/vague/' : `/#${section}`;
          const links = [...html.matchAll(/<a\b[^>]*href="([^\"]+)"[^>]*>[\s\S]*?<\/a>/g)]
            .filter((match) => match[1] === returnHref && match[0].includes('Back to'));
          assert.equal(links.length, 2, `${item.id}: top and bottom return links`);
          for (const link of links) assert.ok(link[0].includes('<span aria-hidden="true">←</span>'), item.id);
          assert.ok(links[0].index < html.indexOf('<h1'), `${item.id}: top link before title`);
          assert.ok(links[1].index > html.indexOf('</h1>'), `${item.id}: bottom link after content`);
        }
      }
    });

    await t.test('research details show complete verified citations, authors and publication dates', () => {
      for (const article of articles) {
        const html = render(`#/research/${article.id}`);
        assert.ok(html.includes(`<em>${article.journal}</em>`), `${article.id}: italic journal`);
        if (article.volume) assert.ok(html.includes(`<strong class="font-bold">${article.volume}</strong>`), `${article.id}: bold volume`);
        if (article.articleNumber ?? article.pages) assert.ok(html.includes(`, ${article.articleNumber ?? article.pages} (${article.date.slice(0, 4)})`));
        for (const author of article.authors) assert.ok(html.includes(author.name), `${article.id}: author ${author.name}`);
        assert.ok(html.includes(`<time dateTime="${article.date}">${formatDetailDate(article.date)}</time>`), `${article.id}: publication date`);
        assert.ok(!html.includes('Published'), 'date has no Published prefix');
        if (article.status === 'preprint') {
          assert.ok(html.includes(`<em>arXiv</em>:${article.preprintId} (${article.date.slice(0, 4)})`));
          assert.ok(html.includes('Preprint'));
        }
      }
      const prb = render('#/research/reconfigurable-skyrmion-2024');
      assert.ok(prb.includes('<em>Physical Review B</em> <strong class="font-bold">109</strong>, 174420 (2024)'));
      const acs = render('#/research/pdco-fieldlike-sot-2025');
      assert.ok(acs.includes('<em>ACS Applied Electronic Materials</em> <strong class="font-bold">7</strong>, 4501–4509 (2025)'));
      assert.ok(acs.includes('May 12 (2025)'), 'online publication date, not May 27 issue date');
      for (const id of ['probabilistic-multiplication-2026', 'field-like-torque-2026']) {
        const html = render(`#/research/${id}`);
        assert.ok(html.includes('<em>Scientific Reports</em> (2026)'), 'publisher has no volume or article number yet');
        assert.ok(!html.includes('<strong class="font-bold">'), 'missing bibliographic numbers are not invented');
      }
    });

    await t.test('research overviews replace detail captions while thumbnail captions stay short', () => {
      const homepage = render('#research');
      const escaped = (text) => renderToStaticMarkup(React.createElement('p', null, text)).slice(3, -4);
      for (const article of articles) {
        assert.ok(article.summary?.length >= 2, `${article.id}: substantive overview`);
        const words = article.summary.join(' ').trim().split(/\s+/);
        assert.ok(words.length <= 300, `${article.id}: ${words.length} words exceeds limit`);
        assert.ok(words.length >= 80, `${article.id}: overview is longer than a thumbnail caption`);
        const detail = render(`#/research/${article.id}`);
        assert.ok(detail.includes('aria-label="Research overview"'));
        for (const paragraph of article.summary) {
          assert.ok(detail.includes(`<p>${escaped(paragraph)}</p>`), `${article.id}: complete overview renders`);
          assert.ok(!homepage.includes(escaped(paragraph)), `${article.id}: overview stays off the thumbnail`);
        }
        assert.ok(homepage.includes(escaped(article.caption)), `${article.id}: original thumbnail caption retained`);
        assert.ok(!detail.includes(escaped(article.caption)), `${article.id}: short caption replaced in the body`);
      }
      for (const activity of activities) {
        if (!activity.detailImage) assert.ok(render(`#/activities/${activity.id}`).includes(escaped(activity.caption)), `${activity.id}: activity description retained`);
      }
      const pom = render('#/activities/pm26-moire-chaos');
      assert.ok(homepage.includes('src="/images/activities/pm26-photo.jpg"'), 'PoM thumbnail keeps the supplied photo');
      assert.ok(pom.includes('src="/images/activities/pm26-abstract.png"'), 'PoM detail displays the submitted abstract');
      for (const activity of activities) {
        if (!activity.image || activity.image === activity.detailImage?.src) continue;
        const detail = render(`#/activities/${activity.id}`);
        assert.ok(homepage.includes(`src="${activity.image}"`), `${activity.id}: photo stays on the homepage`);
        assert.ok(!detail.includes(`src="${activity.image}"`), `${activity.id}: photo stays off the detail page`);
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
