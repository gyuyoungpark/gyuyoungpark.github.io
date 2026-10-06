import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildKeywordIndex,
  filterByKeywords,
  keywordFromHash,
  keywordHref,
  keywordSelectionHref,
  keywordsFromHash,
  keywordPalette,
  keywordStyle,
  keywordTextColor,
  normalizeKeyword,
  toggleKeyword,
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
  assert.deepEqual(index.map(({ label }) => label), ['Electron Hydrodynamics', 'New Topic']);
  assert.deepEqual(index[0].contents.map(({ href }) => href), ['/#/columns/electron-fluid']);
  assert.deepEqual(index[1].contents.map(({ href }) => href), ['/#research-item-1', '/#activity-item-1']);
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
  assert.deepEqual(buildKeywordIndex(entries, ['', 'Magnetism']), []);
});

test('removing the last related item removes its keyword even when it is seeded', () => {
  const entry = content({ tags: ['Spintronics'] });
  const seeds = ['Magnetism', 'Spintronics'];
  assert.deepEqual(buildKeywordIndex([entry], seeds).map(({ label }) => label), ['Spintronics']);
  assert.deepEqual(buildKeywordIndex([], seeds), []);
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

test('multiple keyword routes round-trip distinct topics, including literal commas', () => {
  const href = keywordSelectionHref(['Chaos', 'A,B / C%', ' CHAOS ', '전자의 흐름']);
  assert.deepEqual(keywordsFromHash(href.slice(1)), ['chaos', 'a,b / c%', '전자의 흐름']);
  assert.equal(keywordSelectionHref([]), '/#keywords');
  assert.deepEqual(keywordsFromHash('#/keywords/chaos,%'), []);
});

test('toggling permits multiple selection, individual removal, and removal of the last topic', () => {
  const selected = toggleKeyword(['Chaos'], 'Spintronics');
  assert.deepEqual(selected, ['chaos', 'spintronics']);
  assert.deepEqual(toggleKeyword(selected, ' ＣＨＡＯＳ '), ['spintronics']);
  assert.deepEqual(toggleKeyword(['Spintronics'], 'spintronics'), []);
  assert.deepEqual(selected, ['chaos', 'spintronics'], 'input is not mutated');
});

test('filters require every selected topic across metadata formats without duplicating posts', () => {
  const entries = [
    content({ id: 'chaos', tags: ['Chaos', 'Spintronics'] }),
    content({ id: 'spin', tags: [{ name: 'Ｓｐｉｎｔｒｏｎｉｃｓ' }] }),
    content({ id: 'fluid', tags: ['Electron Hydrodynamics'] }),
  ];
  assert.deepEqual(filterByKeywords(entries, ['chaos']).map(({ id }) => id), ['chaos']);
  assert.deepEqual(filterByKeywords(entries, ['Spintronics']).map(({ id }) => id), ['chaos', 'spin']);
  assert.deepEqual(filterByKeywords(entries, [' CHAOS ', 'Spintronics']).map(({ id }) => id), ['chaos']);
  assert.deepEqual(filterByKeywords(entries, ['Chaos', 'Electron Hydrodynamics']), [], 'different posts cannot jointly satisfy AND');
  assert.deepEqual(filterByKeywords(entries, ['Chaos', 'Unknown']), [], 'one unmatched selected topic excludes the post');
  assert.deepEqual(filterByKeywords(entries, []), entries, 'Clear restores all posts');
  assert.deepEqual(filterByKeywords(entries, ['Unknown']), []);
});

test('keyword colors stay consistent within the page as content changes', () => {
  const before = keywordStyle('A new physics topic');
  const index = buildKeywordIndex([content({ tags: ['Unrelated tag', 'A new physics topic'] })]);
  assert.deepEqual(keywordStyle(index[1].label), before);
  assert.deepEqual(keywordStyle('A   NEW\nphysics topic'), before);
  for (const label of ['constructor', 'toString', '__proto__']) {
    assert.match(keywordStyle(label).backgroundColor, /^#[a-f\d]{6}$/iu);
  }
});

test('random selection can reach every supplied swatch and is cached per keyword', (t) => {
  assert.equal(keywordPalette.length, 90);
  for (const [i, background] of keywordPalette.entries()) {
    const random = t.mock.method(Math, 'random', () => (i + 0.5) / keywordPalette.length);
    const label = `Palette selection ${i}`;
    assert.equal(keywordStyle(label).backgroundColor, background);
    assert.deepEqual(keywordStyle(` ${label.toUpperCase()} `), keywordStyle(label));
    assert.equal(random.mock.callCount(), 1, 'rerenders and matching badges do not reroll colors');
    random.mock.restore();
  }
});

test('every chart color uses the stronger black or white contrast and meets 4.5:1', () => {
  for (const background of keywordPalette) {
    assert.match(background, /^#[A-F\d]{6}$/u);
    const rgb = background.slice(1).match(/../gu).map((channel) => parseInt(channel, 16) / 255);
    const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    const light = linear.reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
    const contrast = { '#000000': (light + 0.05) / 0.05, '#FFFFFF': 1.05 / (light + 0.05) };
    const foreground = keywordTextColor(background);
    assert.ok(contrast[foreground] >= 4.5, `${background} with ${foreground}`);
    assert.equal(contrast[foreground], Math.max(...Object.values(contrast)));
  }
});
