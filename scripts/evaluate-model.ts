import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { AppStatus, CatalogEntry, RecommendationResponse, Stage } from '../shared/types';

const base = process.env.APP_URL || 'http://127.0.0.1:3001';
async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${base}${path}`, body === undefined ? undefined : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
  return result as T;
}

const status = await request<AppStatus>('/api/status');
if (!status.model.configured) {
  console.error('尚未配置模型 API，未执行智能匹配评测。请配置 .env，启动服务后再运行此命令。');
  process.exit(2);
}
const { entries } = await request<{ entries: CatalogEntry[] }>('/api/catalog');
const cases = JSON.parse(await readFile(resolve('scripts/evaluation-cases.json'), 'utf8')) as
  { stage: Stage; description: string; expectedId: string }[];
const readyIds = new Set(entries.filter(entry => entry.status === 'ready' && entry.preview.verified).map(entry => entry.id));
if (cases.some(item => !readyIds.has(item.expectedId))) {
  throw new Error('评测要求的首批案例缺失或预览未验证，请先完成参考视频录制与验证。');
}
const results = [];
for (const [index, item] of cases.entries()) {
  try {
    const recommendation = await request<RecommendationResponse>('/api/recommend', {
      description: item.description, stage: item.stage, selections: [], excludedIds: []
    });
    const matched = recommendation.mode === 'model' && recommendation.candidates.some(candidate => candidate.entryId === item.expectedId);
    results.push({ ...item, matched, candidates: recommendation.candidates });
    console.log(`${index + 1}/${cases.length} ${matched ? '命中' : '未命中'} ${item.expectedId}`);
  } catch (error) {
    results.push({ ...item, matched: false, error: error instanceof Error ? error.message : String(error) });
    console.log(`${index + 1}/${cases.length} 调用失败`);
  }
}
const hits = results.filter(item => item.matched).length;
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/model-evaluation.json', JSON.stringify({
  evaluatedAt: new Date().toISOString(), model: status.model.name, hits, total: cases.length, passed: hits >= 16, results
}, null, 2));
console.log(`前三候选命中 ${hits}/${cases.length}；验收要求至少16条。结果：artifacts/model-evaluation.json`);
process.exitCode = hits >= 16 ? 0 : 1;
