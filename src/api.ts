import type { AppStatus, CatalogEntry, DemoRequest, DemoResult, DesignPromptRequest, DesignPromptResult, ExportRequest, RecommendationRequest, RecommendationResponse, SourceInfo } from '../shared/types';
import { isDemoResult } from './demo-session';
import { isRequirementDraft, requirementsContextMessages } from './requirements';
import type { ComponentImplementation, DesignLibrary, PageRecipe } from '../shared/design-library';

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  let result;
  try { result = await response.json(); } catch { throw new Error('服务没有返回可读取的数据，请检查本地服务是否启动。'); }
  if (!response.ok) throw new Error(result.error || `请求失败（${response.status}）`);
  return result as T;
}

const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) });

async function readStream<T>(path: string, body: RecommendationRequest | DemoRequest | DesignPromptRequest, onMessage: (content: string) => void, validate: (value: unknown) => value is T, incomplete: string, signal?: AbortSignal): Promise<T> {
  signal?.throwIfAborted();
  const response = await fetch(`/api${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body: JSON.stringify({ ...body, messages: body.messages && requirementsContextMessages(body.messages) }), signal });
  if (!response.ok) {
    let error = `请求失败（${response.status}）`;
    try { error = (await response.json()).error || error; } catch { /* Keep the HTTP failure if there is no JSON response. */ }
    throw new Error(error);
  }
  if (!response.body) throw new Error('服务没有返回可读取的回复流。');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal?.addEventListener('abort', cancel, { once: true });
  try {
    while (true) {
      signal?.throwIfAborted();
      const { value, done } = await reader.read();
      signal?.throwIfAborted();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).replace(/^ /, '')).join('\n');
        if (!data) continue;
        let event;
        try { event = JSON.parse(data); } catch { throw new Error('回复流中的数据无法读取，请重试。'); }
        if (event.type === 'error') throw new Error(event.error || '智能体回复失败，请重试。');
        if (event.type === 'message' && typeof event.content === 'string') onMessage(event.content);
        if (event.type === 'result') {
          const result: unknown = event.result;
          if (!validate(result)) throw new Error(incomplete);
          signal?.throwIfAborted();
          return result;
        }
      }
      if (done) throw new Error(incomplete);
    }
  } finally {
    signal?.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

const isRecommendation = (value: unknown): value is RecommendationResponse => {
  const result = value as RecommendationResponse;
  return !!result && ['model', 'manual'].includes(result.mode) && typeof result.message === 'string' && Array.isArray(result.candidates) && result.candidates.every(candidate => candidate && typeof candidate.entryId === 'string' && typeof candidate.reason === 'string');
};

const isDesignPrompt = (value: unknown): value is DesignPromptResult => { const result = value as DesignPromptResult; return !!result && typeof result.message === 'string' && typeof result.developerPrompt === 'string' && !!result.developerPrompt.trim() && Array.isArray(result.referenceEntryIds) && result.referenceEntryIds.every(id => typeof id === 'string') && Array.isArray(result.assumptions) && result.assumptions.every(value => typeof value === 'string') && (result.requirementDraft === undefined || isRequirementDraft(result.requirementDraft)); };
const promptStream = (body: DesignPromptRequest, onMessage: (content: string) => void, signal?: AbortSignal) => readStream('/design-prompt/stream', body, onMessage, isDesignPrompt, '智能体没有返回完整的专业提示词，请重试。', signal);

const recommendStream = (body: RecommendationRequest, onMessage: (content: string) => void, signal?: AbortSignal) => readStream('/recommend/stream', body, onMessage, isRecommendation, '智能体没有返回完整的推荐结果，请重试。', signal);
const demoStream = (body: DemoRequest, onMessage: (content: string) => void, signal?: AbortSignal): Promise<DemoResult> => readStream('/demo/stream', body, onMessage, isDemoResult, '智能体没有返回完整的页面与提示词，请重试。', signal);

export const api = {
  designLibrary: () => request<DesignLibrary>('/design-library'),
  designExample: (kind: 'page' | 'component', id: string, signal?: AbortSignal) => request<{ item: PageRecipe | ComponentImplementation; html: string; developerPrompt: string }>(`/design-library/${kind}/${encodeURIComponent(id)}`, { signal }),
  status: () => request<AppStatus>('/status'),
  catalog: () => request<{ entries: CatalogEntry[] }>('/catalog'),
  sources: () => request<{ sources: SourceInfo[] }>('/sources'),
  recommend: (body: RecommendationRequest) => post<RecommendationResponse>('/recommend', { ...body, messages: body.messages && requirementsContextMessages(body.messages) }),
  recommendStream,
  promptStream,
  demoStream,
  export: (body: ExportRequest) => post<{ markdown: string }>('/export', body),
  sync: (sourceId: string) => post<{ source: SourceInfo; importedCount: number; entries: CatalogEntry[] }>('/sources/sync', { sourceId }),
  import: (url: string, stage: string) => post<{ entry: CatalogEntry }>('/sources/import', { url, stage }),
  edit: (id: string, aliases: string[], userNotes: string) => request<{ entry: CatalogEntry }>(`/catalog/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ aliases, userNotes }) }),
  verify: (id: string) => post<{ entry: CatalogEntry }>(`/catalog/${encodeURIComponent(id)}/verify-preview`, {}),
};
