import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export interface SelectionMainVisual {
  role: 'background' | 'hero' | 'title';
  family: string;
  entryIds: string[];
  description: string;
}

export interface SelectionHistoryRecord {
  id: string;
  pageKey: string;
  purpose: string;
  createdAt: string;
  referenceEntryIds: string[];
  mainVisuals?: SelectionMainVisual[];
}

const visualSchema = z.object({
  role: z.enum(['background', 'hero', 'title']),
  family: z.string(),
  entryIds: z.array(z.string()),
  description: z.string(),
});
const recordSchema = z.object({
  id: z.string().min(1),
  pageKey: z.string().min(1),
  purpose: z.string(),
  createdAt: z.string().datetime(),
  referenceEntryIds: z.array(z.string()),
  mainVisuals: z.array(visualSchema).optional(),
});
const queues = new Map<string, Promise<void>>();

export class SelectionHistoryStore {
  private file: string;
  private queueKey: string;
  constructor(rootDir: string) {
    this.file = path.resolve(rootDir, 'data/selection-history.json');
    this.queueKey = process.platform === 'win32' ? this.file.toLowerCase() : this.file;
  }

  private async read(): Promise<SelectionHistoryRecord[]> {
    try {
      return z.array(recordSchema).parse(JSON.parse(await readFile(this.file, 'utf8')));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw new Error(`近期选材记录无法读取，请检查 ${this.file}；原文件已保留。`, { cause: error });
    }
  }

  async list(): Promise<SelectionHistoryRecord[]> {
    await queues.get(this.queueKey);
    return this.read();
  }

  record(record: Omit<SelectionHistoryRecord, 'id' | 'createdAt'>): Promise<void> {
    // Parsing projects the input onto the summary fields and excludes prompts or credentials.
    const summary = recordSchema.omit({ id: true, createdAt: true }).parse(record);
    const next = (queues.get(this.queueKey) || Promise.resolve()).then(async () => {
      const previous = await this.read();
      const records: SelectionHistoryRecord[] = [{ ...summary, id: randomUUID(), createdAt: new Date().toISOString() },
        ...previous.filter(item => item.pageKey !== summary.pageKey)].slice(0, 30);
      await mkdir(path.dirname(this.file), { recursive: true });
      const temporary = this.file + '.' + randomUUID() + '.tmp';
      await writeFile(temporary, JSON.stringify(records, null, 2) + '\n', 'utf8');
      await rename(temporary, this.file);
    });
    queues.set(this.queueKey, next.then(() => undefined, () => undefined));
    return next;
  }
}
