import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('YouTube initplayback rewrite rejects oad in any query position', async () => {
  const module = await readFile(resolve(rootDir, 'YouTube.Enhance.sgmodule'), 'utf8');
  const line = module.split('\n').find((value) => value.includes('googlevideo') && value.includes('initplayback'));
  assert.ok(line, 'missing initplayback rewrite');

  const pattern = line.split(/\s+_\s+/)[0];
  const rewrite = new RegExp(pattern);
  assert.equal(rewrite.test('https://r1---sn-example.googlevideo.com/initplayback?oad=1'), true);
  assert.equal(rewrite.test('https://r1---sn-example.googlevideo.com/initplayback?foo=1&oad=1'), true);
  assert.equal(rewrite.test('https://r1---sn-example.googlevideo.com/initplayback?foo=1&bar=2&oad'), true);
  assert.equal(rewrite.test('https://r1---sn-example.googlevideo.com/initplayback?foo=1'), false);
});
