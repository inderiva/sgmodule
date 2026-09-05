import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('FanQieNovel keeps the narrowed ad and log rules', async () => {
  const module = await readFile(resolve(rootDir, 'FanQieNovel.sgmodule'), 'utf8');

  for (const rule of [
    'DOMAIN,log-api.pangolin-sdk-toutiao.com,REJECT',
    'DOMAIN,ads3-normal-lf.zijieapi.com,REJECT',
    'DOMAIN,ads5-normal-lf.zijieapi.com,REJECT',
    'DOMAIN,feedback-c.zijieapi.com,REJECT',
    'DOMAIN,mcs.zijieapi.com,REJECT',
    'DOMAIN,mon.zijieapi.com,REJECT',
    'DOMAIN,timon.zijieapi.com,REJECT',
    'DOMAIN,time.apple.com,DIRECT',
  ]) {
    assert.ok(module.includes(rule), `missing ${rule}`);
  }

  for (const forbidden of [
    'DOMAIN-KEYWORD,zijieapi',
    'DOMAIN-SUFFIX,bytedance.com',
  ]) {
    assert.equal(module.includes(forbidden), false, `unexpected broad rule: ${forbidden}`);
  }
});

test('FanQieNovel excludes the four MITM hosts that break verification', async () => {
  const module = await readFile(resolve(rootDir, 'FanQieNovel.sgmodule'), 'utf8');
  const mitm = module.split('\n').find((line) => line.startsWith('hostname = %APPEND%'));

  assert.ok(mitm, 'missing MITM hostname list');
  for (const excluded of [
    '-log-api.pangolin-sdk-toutiao.com',
    '-guide-acs.m.taobao.com',
    '-tnc0-alisc1.zijieapi.com',
    '-tnc0-aliec2.zijieapi.com',
  ]) {
    assert.ok(mitm.includes(excluded), `missing MITM exclusion: ${excluded}`);
  }
});
