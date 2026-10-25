import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { SelectionHistoryStore } from '../server/selection-history';

const roots: string[] = [];
async function temporaryRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'selection-history-'));
  roots.push(root);
  return root;
}
const sample = (pageKey = 'page-one') => ({
  pageKey,
  purpose: '课程资料查询页',
  referenceEntryIds: ['aurora', 'floating-books'],
  mainVisuals: [{ role: 'hero' as const, family: 'floating-objects', entryIds: ['floating-books'], description: '悬浮的课程书册' }],
});
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))); });

describe('recent selection history persistence', () => {
  it('starts empty and persists only summaries across store instances', async () => {
    const root = await temporaryRoot();
    const store = new SelectionHistoryStore(root);
    expect(await store.list()).toEqual([]);
    await store.record({ ...sample(), prompt: '不得保存完整提示词', apiKey: '不得保存密钥' } as ReturnType<typeof sample>);
    const records = await new SelectionHistoryStore(root).list();
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject(sample());
    expect(records[0].id).toEqual(expect.any(String));
    expect(new Date(records[0].createdAt).toISOString()).toBe(records[0].createdAt);
    const saved = await readFile(path.join(root, 'data/selection-history.json'), 'utf8');
    expect(saved).not.toContain('prompt');
    expect(saved).not.toContain('apiKey');
  });

  it('replaces earlier revisions of the same page without increasing frequency', async () => {
    const store = new SelectionHistoryStore(await temporaryRoot());
    await store.record(sample('page-one'));
    await store.record(sample('page-two'));
    await store.record({ ...sample('page-one'), referenceEntryIds: ['new-effect'] });
    const records = await store.list();
    expect(records.map(record => record.pageKey)).toEqual(['page-one', 'page-two']);
    expect(records[0].referenceEntryIds).toEqual(['new-effect']);
  });

  it('keeps the latest thirty different pages', async () => {
    const store = new SelectionHistoryStore(await temporaryRoot());
    for (let index = 0; index < 35; index++) await store.record(sample(`page-${index}`));
    const records = await store.list();
    expect(records).toHaveLength(30);
    expect(records[0].pageKey).toBe('page-34');
    expect(records.at(-1)?.pageKey).toBe('page-5');
  });

  it('serializes concurrent writes from different instances sharing a root', async () => {
    const root = await temporaryRoot();
    const first = new SelectionHistoryStore(root);
    const second = new SelectionHistoryStore(path.join(root, '.'));
    await Promise.all(Array.from({ length: 25 }, (_, index) => (index % 2 ? first : second).record(sample(`concurrent-${index}`))));
    const records = await first.list();
    expect(records).toHaveLength(25);
    expect(new Set(records.map(record => record.pageKey)).size).toBe(25);
    expect(JSON.parse(await readFile(path.join(root, 'data/selection-history.json'), 'utf8'))).toEqual(records);
  });

  it.each(['{broken', '{}', '[{"pageKey":"missing-fields"}]'])('reports damaged data without overwriting it: %s', async damaged => {
    const root = await temporaryRoot();
    const file = path.join(root, 'data/selection-history.json');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, damaged, 'utf8');
    const store = new SelectionHistoryStore(root);
    await expect(store.list()).rejects.toThrow(/selection-history\.json/);
    await expect(store.record(sample())).rejects.toThrow(/selection-history\.json/);
    expect(await readFile(file, 'utf8')).toBe(damaged);
  });
});
