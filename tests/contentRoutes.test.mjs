import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { contentHref, contentRouteFromHash, contentRouteFromPath, doiHref } from '../src/lib/contentRoutes.ts';

test('detail links preserve IDs and distinguish sections', () => {
  for (const section of ['research', 'activities', 'columns', 'achievements']) {
    for (const id of ['moire-chaos-2026', '전자의 흐름', 'A/B + 100%']) {
      const href = contentHref(section, id);
      assert.deepEqual(contentRouteFromHash(href.slice(1)), { section, id });
    }
  }
});

test('section anchors, keyword filters and malformed detail URLs do not become detail routes', () => {
  for (const hash of ['', '#research', '#activities', '#columns', '#achievements', '#/keywords/chaos',
    '#/research/', '#/research/%20', '#/activities/%', '#/columns/%E0%A4%A',
    '#/research/id/extra', '#/unknown/id']) {
    assert.equal(contentRouteFromHash(hash), null, hash);
  }
});

test('the SEO pilot uses real language paths while old links remain readable', () => {
  assert.equal(contentHref('columns', 'electron-fluid'), '/columns/electron-fluid/');
  assert.deepEqual(contentRouteFromPath('/columns/electron-fluid/'), { section: 'columns', id: 'electron-fluid', language: 'en' });
  assert.deepEqual(contentRouteFromPath('/columns/electron-fluid/ko/'), { section: 'columns', id: 'electron-fluid', language: 'ko' });
  assert.deepEqual(contentRouteFromHash('#/columns/electron-fluid'), { section: 'columns', id: 'electron-fluid' });
  for (const path of ['/', '/columns/', '/columns/other/', '/columns/electron-fluid/extra/']) assert.equal(contentRouteFromPath(path), null);
  assert.equal(contentHref('research', 'electron-fluid'), '/#/research/electron-fluid');
});

test('DOI links use the resolver and keep the complete identifier', () => {
  const id = '10.1103/PhysRevB.109.174420';
  for (const value of [id, ` ${id} `, `doi: ${id}`, `https://doi.org/${id}`, `http://dx.doi.org/${id}`]) {
    assert.equal(doiHref(value), `https://doi.org/${id}`);
  }
  for (const value of [undefined, '', ' ', 'doi:']) assert.equal(doiHref(value), undefined);
});

test('every published record has a unique detail URL and research links use its recorded DOI', () => {
  const papers = JSON.parse(readFileSync(new URL('../src/data/research-papers.json', import.meta.url), 'utf8'));
  const activities = JSON.parse(readFileSync(new URL('../src/data/activities.json', import.meta.url), 'utf8'));
  const links = [...papers.map((item) => contentHref('research', item.id)),
    ...activities.map((item) => contentHref('activities', item.id))];
  assert.equal(new Set(links).size, papers.length + activities.length);
  for (const paper of papers) {
    assert.match(paper.doi, /^10\.\d{4,9}\/\S+$/);
    assert.equal(doiHref(paper.doi), `https://doi.org/${paper.doi}`);
  }
});
