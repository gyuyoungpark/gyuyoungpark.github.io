import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

test('column term links respect language, context, and first use', async (t) => {
  const server = await createServer({
    root: fileURLToPath(new URL('..', import.meta.url)), configFile: false,
    optimizeDeps: { noDiscovery: true, entries: [] },
    server: { middlewareMode: true, hmr: false },
  });
  try {
    const { linkColumnParagraphs } = await server.ssrLoadModule('/src/lib/columnText.ts');
    const flatten = (tokens) => tokens.flatMap((token) => token.type === 'strong' ? flatten(token.children) : token);

    await t.test('English aliases link once, including a first use inside emphasis', () => {
      const result = linkColumnParagraphs([
        { type: 'heading', text: 'Electrons' },
        { type: 'paragraph', text: 'Electronically, **Electrons** exchange momentum. An electron moves.' },
        { type: 'paragraph', text: 'ELECTRONS encounter a vortex and other vortices.' },
      ], 'en');
      const links = result.flatMap(flatten).filter((token) => token.type === 'link');
      assert.deepEqual(links.map((token) => token.text), ['Electrons', 'momentum', 'vortex']);
      assert.equal(links[0].href, 'https://en.wikipedia.org/wiki/Electron');
      assert.equal(result[1][0].text, 'Electronically, ');
      assert.equal(result[1][1].type, 'strong');
    });

    await t.test('English matches whole words and leaves inline mathematics untouched', () => {
      const [tokens] = linkColumnParagraphs([{ type: 'paragraph', text: 'Nonlinear response and \\(momentum\\), then linear response.' }], 'en');
      assert.deepEqual(tokens.filter((token) => token.type === 'link').map((token) => token.text), ['linear response']);
      assert.equal(tokens.find((token) => token.type === 'math').text, 'momentum');
    });

    await t.test('Korean first-use links remain independent of English', () => {
      const result = linkColumnParagraphs([
        { type: 'paragraph', text: '**전자**의 운동량과 전자' },
        { type: 'paragraph', text: '운동량과 전압' },
      ]);
      const links = result.flatMap(flatten).filter((token) => token.type === 'link');
      assert.deepEqual(links.map((token) => token.text), ['전자', '운동량', '전압']);
      assert.ok(links.every((token) => token.href.startsWith('https://ko.wikipedia.org/')));
    });
  } finally {
    await server.close();
  }
});
