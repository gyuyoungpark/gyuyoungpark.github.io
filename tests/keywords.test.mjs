import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildKeywordIndex,
  keywordFromHash,
  keywordHref,
  keywordStyle,
  normalizeKeyword,
} from '../src/lib/keywords.ts';

function content(overrides = {}) {
  return {
    id: 'electron-fluid', title: 'When do electrons flow like water?',
    section: 'VAGUE', href: '/#/columns/electron-fluid',
    tags: ['Electron Hydrodynamics'], ...overrides,
  };
}

test('new content keywords are collected across all sections and link back to the source', () => {
  const inputs = [
    content(),
    content({ id: '1', title: 'A research result', section: 'Research', href: '/#research-item-1', tags: [{ name: 'New Topic' }] }),
    content({ id: '1', title: 'A seminar', section: 'Activities', href: '/#activity-item-1', tags: ['New Topic'] }),
  ];
  const index = buildKeywordIndex(inputs, ['Magnetism']);
  assert.deepEqual(index.map(({ label }) => label), ['Magnetism', 'Electron Hydrodynamics', 'New Topic']);
  assert.deepEqual(index[0].contents, []);
  assert.deepEqual(index[1].contents.map(({ href }) => href), ['/#/columns/electron-fluid']);
  assert.deepEqual(index[2].contents.map(({ href }) => href), ['/#research-item-1', '/#activity-item-1']);
});

test('case, extra whitespace, unicode width and repeated content do not duplicate keywords or results', () => {
  const entry = content({ tags: [' Spintronics ', { name: 'SPINTRONICS' }, 'Ｓｐｉｎｔｒｏｎｉｃｓ', 'Electron\n  Fluid', 'electron fluid'] });
  const index = buildKeywordIndex([entry, entry], ['Spintronics', ' spintronics ']);
  assert.deepEqual(index.map(({ id }) => id), ['spintronics', 'electron fluid']);
  assert.equal(index[0].label, 'Spintronics');
  assert.equal(index[1].label, 'Electron Fluid');
  assert.deepEqual(index.map(({ contents }) => contents.length), [1, 1]);
  assert.equal(entry.tags[0], ' Spintronics ', 'source tags remain unchanged');
});

test('empty or untitled placeholder content cannot create keywords or misleading results', () => {
  const entries = [
    content({ title: '   ', tags: ['Placeholder'] }),
    content({ title: ' Untitled ', tags: ['Placeholder'] }),
    content({ id: '', tags: ['Placeholder'] }),
    content({ href: ' ', tags: ['Placeholder'] }),
    content({ tags: ['', '   ', { name: '\n' }] }),
  ];
  assert.deepEqual(buildKeywordIndex(entries, ['', 'Magnetism']), [
    { id: 'magnetism', label: 'Magnetism', contents: [] },
  ]);
});

test('keyword links round-trip punctuation, non-Latin text, slashes and encoded percent signs', () => {
  for (const label of ['Spin-Orbit Torque', '전자의 흐름', 'A/B + C?', '100% transport', 'ＣＨＡＯＳ']) {
    const href = keywordHref(label);
    assert.ok(href.startsWith('/#/keywords/'));
    assert.equal(keywordFromHash(href.slice(1)), normalizeKeyword(label));
  }
});

test('missing, unrelated or malformed keyword routes are rejected without throwing', () => {
  for (const hash of ['', '#columns', '#/columns/electron-fluid', '#/keywords/', '#/keywords/%20', '#/keywords/%', '#/keywords/%E0%A4%A']) {
    assert.equal(keywordFromHash(hash), null, hash);
  }
});

test('keyword colors preserve established topics and stay stable as content changes', () => {
  const expected = {
    Magnetism: '#0072B2', Spintronics: '#009E73', Chaos: '#D55E00',
    'Magnetic Skyrmion': '#CC79A7', 'Spin-Orbit Torque': '#E69F00',
    'Probabilistic Computing': '#56B4E9', 'Electron Hydrodynamics': '#0072B2',
    'Electron Transport Theory': '#56B4E9', Graphene: '#E69F00',
  };
  for (const [label, background] of Object.entries(expected)) {
    assert.equal(keywordStyle(label).backgroundColor, background);
    assert.deepEqual(keywordStyle(` ${label.toUpperCase()} `), keywordStyle(label));
  }
  const before = keywordStyle('A new physics topic');
  const index = buildKeywordIndex([content({ tags: ['Unrelated tag', 'A new physics topic'] })]);
  assert.deepEqual(keywordStyle(index[1].label), before);
  assert.deepEqual(keywordStyle('A   NEW\nphysics topic'), before);
  for (const label of ['constructor', 'toString', '__proto__']) {
    assert.match(keywordStyle(label).backgroundColor, /^#[a-f\d]{6}$/iu);
  }
});
