import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDetailDate } from '../src/lib/detailDate.ts';

test('detail dates use full English months and a parenthesized year', () => {
  assert.equal(formatDetailDate('2026-08-31'), 'August 31 (2026)');
  assert.equal(formatDetailDate('2024-05-09'), 'May 9 (2024)');
  assert.equal(formatDetailDate('2024-02-29'), 'February 29 (2024)');
});

test('partial and invalid dates do not acquire invented days', () => {
  assert.equal(formatDetailDate('2023-11'), 'November (2023)');
  for (const value of ['2015', 'Spring 2015', '2026-02-29', '2026-13-01', '2026-08-00', '']) {
    assert.equal(formatDetailDate(value), value);
  }
});
