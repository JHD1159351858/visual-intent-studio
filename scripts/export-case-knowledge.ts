import type { CatalogEntry } from '../shared/types';
import type { CaseKnowledge } from '../shared/case-knowledge';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isReady } from '../server/core';
import { loadCaseKnowledge } from '../server/case-knowledge';
import { CatalogStore } from '../server/store';

export function buildCaseKnowledgeMarkdown(entries: CatalogEntry[], knowledge: Map<string, CaseKnowledge>): string {
  const ready = entries.filter(isReady);
  if (ready.some(entry => !knowledge.has(entry.id))) throw Error('部分可用案例缺少实现知识，请完成资料后再导出完整文档。');
  const list = (items: string[]) => items.map(item => '- ' + item).join('\n');
  const sections = ready.map(entry => {
    const item = knowledge.get(entry.id)!;
    return [
      `## ${entry.title} · ${entry.name}\n\n案例ID：${entry.id}\n\n来源：${entry.sourceUrl}\n\n资料性质：${item.basis === 'source-code' ? '官方源码机制整理（静态分析，未在目标工程运行）' : '公开视频行为适配建议（非原产品源码）'}`,
      `### 具体行为与作用层\n\n${entry.description}\n\n触发：${entry.trigger}\n\n作用层：${item.layers.join('、')}`,
      `### 实现方法\n\n${item.implementation.summary}\n\n${item.implementation.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
      `依赖：${item.implementation.dependencies.join('、') || '本条未列外部依赖；按来源及目标工程核对，不代表原生App无依赖。'}\n\n参数：\n\n${list(Object.entries(item.implementation.parameters).map(([key, value]) => `${key}：${value}`)) || '未提取原始默认值，不自行补造。'}`,
      `### 适用场景\n\n${list(item.suitableFor)}\n\n避免用于：\n\n${list(item.avoidFor)}`,
      `### 限制与接入建议\n\n${list(item.limitations)}\n\n手机：${item.mobile}\n\n减少动态：${item.reducedMotion}\n\n性能：${item.performance}\n\n${item.notes}`,
      `### 依据\n\n${list(item.evidence.map(evidence => `${evidence.kind}：${evidence.url}；资料核对时间：${evidence.checkedAt}${evidence.sha256 ? `；SHA256：${evidence.sha256}` : ''}${evidence.hashScope ? `；哈希对象：${evidence.hashScope}` : ''}${evidence.paths?.length ? `；文件：${evidence.paths.join('、')}` : ''}`))}`,
    ].join('\n\n');
  });
  return `# 全参考库实现知识\n\n共${ready.length}条可用案例。完整逐项说明保存在本地JSON；DeepSeek请求取得每条同规格摘要，并非350个原组件均已安装或运行。场景、手机、减少动态和性能处理属于项目接入建议；源码事实与视频行为适配分别标注。\n\n${sections.join('\n\n---\n\n')}\n`;
}

export async function exportCaseKnowledge(rootDir: string): Promise<void> {
  const entries = await new CatalogStore(rootDir).list(); const knowledge = await loadCaseKnowledge(rootDir, entries);
  const document = buildCaseKnowledgeMarkdown(entries, knowledge);
  await mkdir(path.join(rootDir, 'docs'), { recursive: true });
  await writeFile(path.join(rootDir, 'docs/reference-implementation-knowledge.md'), document, 'utf8');
  const rows = entries.filter(isReady).map(entry => ({ entryId: entry.id, sourceId: entry.sourceId, sourceUrl: entry.sourceUrl, basis: knowledge.get(entry.id)!.basis }));
  await mkdir(path.join(rootDir, 'data/case-knowledge'), { recursive: true });
  await writeFile(path.join(rootDir, 'data/case-knowledge/manifest.json'), JSON.stringify({ exportedAt: new Date().toISOString(), total: rows.length, counts: Object.fromEntries(['reactbits', 'aceternity', '60fps'].map(source => [source, rows.filter(row => row.sourceId === source).length])), sourceCodeCount: rows.filter(row => row.basis === 'source-code').length, observedBehaviorCount: rows.filter(row => row.basis === 'observed-behavior').length, sourceComponentsExecuted: false, cloudUploaded: false, cases: rows }, null, 2) + '\n', 'utf8');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await exportCaseKnowledge(process.cwd());
  console.log('已导出逐项实现知识文档与覆盖清单；未调用模型、未上传Coze、未运行来源组件。');
}
