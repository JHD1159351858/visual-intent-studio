import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { CatalogEntry, SourceId } from '../shared/types';
import { ApiError } from './core';

export class CatalogStore {
  private queue: Promise<void> = Promise.resolve();
  private file: string;
  constructor(private rootDir: string) { this.file = path.join(rootDir, 'data/catalog.json'); }
  private async read(): Promise<CatalogEntry[]> {
    try {
      const data = JSON.parse(await readFile(this.file, 'utf8'));
      if (!Array.isArray(data)) throw Error('Catalog must be an array');
      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new ApiError('本地目录无法读取，请检查 data/catalog.json。', 503, 'CATALOG_INVALID');
    }
    try {
      const data = JSON.parse(await readFile(path.join(this.rootDir, 'data/catalog.seed.json'), 'utf8'));
      if (!Array.isArray(data)) throw Error('Seed must be an array');
      return data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw new ApiError('初始目录无法读取，请检查 data/catalog.seed.json。', 503, 'CATALOG_INVALID');
    }
  }
  async list(): Promise<CatalogEntry[]> { await this.queue; return this.read(); }
  private async readSourceState(): Promise<Partial<Record<SourceId, string>>> {
    try { return JSON.parse(await readFile(path.join(this.rootDir, 'data/sources-state.json'), 'utf8')); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {};
      throw new ApiError('来源同步记录无法读取，请检查 data/sources-state.json。', 503, 'SOURCE_STATE_INVALID');
    }
  }
  async sourceState(): Promise<Partial<Record<SourceId, string>>> { await this.queue; return this.readSourceState(); }
  markSourceSynced(sourceId: SourceId, date: string): Promise<void> {
    const next = this.queue.then(async () => {
      const state = await this.readSourceState();
      state[sourceId] = date;
      const file = path.join(this.rootDir, 'data/sources-state.json');
      await mkdir(path.dirname(file), { recursive: true });
      const temporary = file + '.' + randomUUID() + '.tmp';
      await writeFile(temporary, JSON.stringify(state, null, 2) + '\n', 'utf8');
      await rename(temporary, file);
    });
    this.queue = next.then(() => undefined, () => undefined);
    return next;
  }
  update(mutator: (entries: CatalogEntry[]) => CatalogEntry[] | Promise<CatalogEntry[]>): Promise<CatalogEntry[]> {
    const next = this.queue.then(async () => {
      const entries = await mutator(await this.read());
      await mkdir(path.dirname(this.file), { recursive: true });
      const temporary = this.file + '.' + randomUUID() + '.tmp';
      await writeFile(temporary, JSON.stringify(entries, null, 2) + '\n', 'utf8');
      await rename(temporary, this.file);
      return entries;
    });
    this.queue = next.then(() => undefined, () => undefined);
    return next;
  }
}
