import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.APP_URL || 'http://127.0.0.1:5174';
async function call(path, body, method = 'POST') {
  const response = await fetch(base + path, body === undefined ? undefined : {
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
  return result;
}

const initial = await call('/api/catalog');
const curated = initial.entries.find(entry => entry.id === 'reactbits-spotlight-card');
assert.ok(curated);
const probe = `同步保留验证 ${Date.now()}`;
const reports = [];
try {
  await call(`/api/catalog/${curated.id}`, { aliases: [...curated.aliases, probe], userNotes: probe }, 'PATCH');
  for (const sourceId of ['aceternity', 'reactbits', 'reactbits']) {
    const result = await call('/api/sources/sync', { sourceId });
    const saved = result.entries.find(entry => entry.id === curated.id);
    assert.equal(saved.title, curated.title);
    assert.equal(saved.description, curated.description);
    assert.equal(saved.preview.url, curated.preview.url);
    assert.equal(saved.status, 'ready');
    assert.ok(saved.aliases.includes(probe));
    assert.equal(saved.userNotes, probe);
    reports.push({ sourceId, importedCount: result.importedCount, total: result.entries.length });
    console.log(`${sourceId}: ${result.importedCount} 条，重复同步保留中文说明、别名、备注和视频`);
  }
  for (const caseUrl of ['https://60fps.design/shots/opal-border-glow-feature-highlight-interaction', 'https://60fps.design/shots/airbnb-tactile-tab-button-interaction']) {
    const previousCase = initial.entries.find(entry => entry.sourceUrl === caseUrl);
    const imported = await call('/api/sources/import', { url: caseUrl, stage: 'effect' });
    assert.equal(imported.entry.sourceId, '60fps');
    assert.equal(imported.entry.preview.type, 'video');
    if (previousCase?.preview.verified && previousCase.preview.url.startsWith('/media/')) {
      assert.equal(imported.entry.title, previousCase.title);
      assert.equal(imported.entry.description, previousCase.description);
      assert.equal(imported.entry.stage, previousCase.stage);
      assert.equal(imported.entry.preview.url, previousCase.preview.url);
      assert.equal(imported.entry.preview.provenance, previousCase.preview.provenance);
      assert.equal(imported.entry.status, 'ready');
    } else assert.equal(imported.entry.preview.provenance, 'original');
    reports.push({ sourceId: '60fps', id: imported.entry.id, title: imported.entry.title, videoUrl: imported.entry.preview.url });
  }
  console.log('60fps: 首批与新增案例导入保留中文资料、分类及已有验证视频');
  const updated = await call('/api/catalog');
  assert.equal(new Set(updated.entries.map(entry => entry.sourceUrl)).size, updated.entries.length);
  assert.ok(updated.entries.filter(entry => entry.status === 'ready').length >= 12);
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/source-sync-report.json', JSON.stringify({ verifiedAt: new Date().toISOString(), reports, total: updated.entries.length }, null, 2));
  console.log(`来源验证通过：共 ${updated.entries.length} 条，已有验证录屏保留。`);
} finally {
  const latest = (await call('/api/catalog')).entries.find(entry => entry.id === curated.id);
  if (latest?.userNotes === probe) {
    await call(`/api/catalog/${curated.id}`, { aliases: curated.aliases, userNotes: curated.userNotes || '' }, 'PATCH');
  }
}
