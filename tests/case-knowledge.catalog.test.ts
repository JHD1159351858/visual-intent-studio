import { expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { compactCaseKnowledge, loadCaseKnowledge } from '../server/case-knowledge';
import { isReady } from '../server/core';
import type { CatalogEntry } from '../shared/types';

const root = process.cwd();
const catalog: CatalogEntry[] = JSON.parse(await readFile(path.join(root, 'data/catalog.json'), 'utf8'));
const ready = catalog.filter(isReady);
const all = () => loadCaseKnowledge(root, catalog);

it('covers exactly the 350 ready cases with three source bundles and no source cross-wiring', async () => {
  const knowledge = await all();
  expect(ready).toHaveLength(350);
  expect([...knowledge.keys()].sort()).toEqual(ready.map(item => item.id).sort());
  for (const sourceId of ['reactbits', 'aceternity', '60fps']) {
    const rows = JSON.parse(await readFile(path.join(root, `data/case-knowledge/${sourceId}.json`), 'utf8'));
    expect(rows.map((item: any) => item.entryId).sort()).toEqual(ready.filter(item => item.sourceId === sourceId).map(item => item.id).sort());
  }
});

it('has case-specific methods, useful scenario/avoidance guidance and complete access/performance advice', async () => {
  const values = [...(await all()).values()];
  expect(values).toHaveLength(350);
  expect(new Set(values.map(item => item.implementation.summary)).size).toBeGreaterThanOrEqual(320);
  for (const item of values) {
    expect(item.implementation.summary.length, item.entryId).toBeGreaterThan(15);
    expect([item.implementation.summary, ...item.implementation.steps].join('').length, item.entryId).toBeGreaterThan(50);
    expect(item.implementation.steps.length, item.entryId).toBeGreaterThanOrEqual(3);
    expect(item.suitableFor.length, item.entryId).toBeGreaterThanOrEqual(2);
    expect(item.avoidFor.length, item.entryId).toBeGreaterThanOrEqual(1);
    expect(item.limitations.length, item.entryId).toBeGreaterThanOrEqual(2);
    for (const field of ['mobile', 'reducedMotion', 'performance'] as const) expect(item[field].length, `${item.entryId}.${field}`).toBeGreaterThan(15);
    expect(item.evidence.every(evidence => evidence.url.startsWith('https://')), item.entryId).toBe(true);
  }
});

it('keeps native app motion examples as behavior adaptations without invented product source or dependencies', async () => {
  const knowledge = await all();
  const shots = ready.filter(item => item.sourceId === '60fps').map(item => knowledge.get(item.id)!);
  expect(shots).toHaveLength(28);
  for (const shot of shots) {
    expect(shot.basis).toBe('observed-behavior');
    expect(shot.evidence.every(item => item.kind !== 'registry' && item.kind !== 'source-code')).toBe(true);
    expect(shot.implementation.dependencies).toEqual([]);
    expect(shot.notes + shot.limitations.join(' ')).toMatch(/适配|建议|改造/);
    expect(shot.notes + shot.limitations.join(' ')).toMatch(/原(?:生|产品|应用|App)|源码/i);
  }
});

it('retains source-code provenance and hashes for all 322 public component cases', async () => {
  const knowledge = await all();
  const components = ready.filter(item => item.sourceId !== '60fps').map(item => knowledge.get(item.id)!);
  expect(components).toHaveLength(322);
  for (const item of components) {
    expect(item.basis, item.entryId).toBe('source-code');
    expect(item.evidence.some(evidence => ['registry', 'source-code'].includes(evidence.kind) && /^[a-f0-9]{64}$/.test(evidence.sha256 || '')), item.entryId).toBe(true);
  }
});

it('keeps the most easily confused reference mechanisms and scope boundaries distinct', async () => {
  const knowledge = await all();
  const find = (sourceId: string, name: string) => {
    const entry = ready.find(item => item.sourceId === sourceId && item.name.replace(/\s/g, '').toLowerCase() === name.replace(/\s/g, '').toLowerCase());
    expect(entry, name).toBeDefined(); return knowledge.get(entry!.id)!;
  };
  const text = (item: ReturnType<typeof find>) => [item.implementation.summary, ...item.implementation.steps, ...item.limitations, item.notes].join(' ');
  expect(text(find('reactbits', 'Liquid Ether'))).toMatch(/压力|Poisson|平流/);
  expect(text(find('reactbits', 'Glass Surface'))).toMatch(/折射|位移/);
  expect(find('reactbits', 'Glass Surface').layers).toContain('surface');
  expect(text(find('reactbits', 'Orbit Images'))).toMatch(/offset|路径|轨道/);
  expect(text(find('aceternity', 'Moving Border'))).toMatch(/路径|周边|轮廓/);
  expect(text(find('aceternity', 'Tracing Beam'))).toMatch(/滚动/);
  expect(text(find('aceternity', 'Background Gradient'))).toMatch(/遮罩|掏空/);
});

it('keeps full knowledge locally and transmits bounded complete summaries rather than source code', async () => {
  const knowledge = await all();
  const compact = [...knowledge.values()].map(compactCaseKnowledge);
  expect(compact).toHaveLength(350);
  expect(JSON.stringify(compact).length).toBeLessThan(600000);
  for (const item of compact) {
    expect(item.method.length).toBeGreaterThan(15);
    expect(item.steps.length).toBeGreaterThan(0);
    expect(item.scenes.length).toBeGreaterThan(0);
    expect(item.limits.length).toBeGreaterThan(0);
    expect(item).not.toHaveProperty('code');
    expect(item).not.toHaveProperty('files');
  }
});

