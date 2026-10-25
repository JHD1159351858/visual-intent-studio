import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { CatalogEntry, Stage } from '../shared/types';
import { normalizeUrl } from './core';

export interface EntryCuration {
  name?: string;
  title: string;
  description: string;
  aliases: string[];
  trigger: string;
  placements: string[];
  tags: string[];
  stage: Stage;
  resolvedSourceUrl?: string;
  implementationUrl?: string | null;
  evidenceUrl?: string;
  evidence?: { url: string };
  verifiedAt?: string;
  issue?: string;
}
export interface CurationBundle { verifiedAt: string; entries: Record<string, EntryCuration> }
const root = fileURLToPath(new URL('../', import.meta.url));

export async function loadCurations(rootDir = root): Promise<Map<string, EntryCuration & { reviewedAt: string }>> {
  const rows = new Map<string, EntryCuration & { reviewedAt: string }>();
  for (const name of ['reactbits.zh.json', 'aceternity.zh.json', '60fps.zh.json']) {
    let bundle: CurationBundle;
    try { bundle = JSON.parse(await readFile(path.join(rootDir, 'data/enrichment', name), 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue; throw error; }
    for (const [url, row] of Object.entries(bundle.entries)) {
      const value = { ...row, reviewedAt: row.verifiedAt || bundle.verifiedAt };
      rows.set(normalizeUrl(url), value);
      if (row.resolvedSourceUrl) rows.set(normalizeUrl(row.resolvedSourceUrl), value);
    }
  }
  return rows;
}
export function applyCuration(entry: CatalogEntry, row: EntryCuration & { reviewedAt: string }): CatalogEntry {
  return {
    ...entry, title: row.title, description: row.description, stage: row.stage,
    aliases: [...new Set([...row.aliases, ...entry.aliases])], trigger: row.trigger,
    placements: row.placements, tags: row.tags,
    sourceUrl: normalizeUrl(row.resolvedSourceUrl || entry.sourceUrl),
    implementationUrl: 'implementationUrl' in row ? row.implementationUrl || undefined : entry.implementationUrl,
    curation: { reviewedAt: row.reviewedAt, evidenceUrl: row.evidence?.url || row.evidenceUrl || entry.sourceUrl },
  };
}
export async function enrichCatalog(entries: CatalogEntry[]): Promise<CatalogEntry[]> {
  const rows = await loadCurations();
  return entries.map(entry => { const row = rows.get(normalizeUrl(entry.sourceUrl)); return row ? applyCuration(entry, row) : entry; });
}
