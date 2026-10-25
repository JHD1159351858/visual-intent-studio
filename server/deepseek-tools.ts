import { DEEPSEEK_IDLE_TIMEOUT_MS, DEEPSEEK_MAX_DURATION_MS, type DeepSeekConfig } from './deepseek';
import type { AgentTool } from './agent-tools';
import { ApiError } from './core';

type Options = { onText?: (content: string) => void; onTool?: (name: string) => void; signal?: AbortSignal };
type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } };
type AssistantMessage = { role: 'assistant'; content: string | null; reasoning_content: string; tool_calls?: ToolCall[] };
type Message = { role: 'system' | 'user'; content: string } | AssistantMessage | { role: 'tool'; tool_call_id: string; content: string };
type Round = { message: AssistantMessage; finish: 'stop' | 'tool_calls' };
const hasText = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
const invalid = () => new ApiError('DeepSeek 没有返回完整的工具调用或正式生成结果；已保留输入和选择，请重试。', 502, 'MODEL_INVALID_RESPONSE');
const limit = () => new ApiError('本次检索已达到工具调用上限；已保留输入和选择，请缩小需求后重试。', 502, 'MODEL_TOOL_LIMIT');

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted();
  return new Promise<T>((resolve, reject) => {
    const abort = () => { signal.removeEventListener('abort', abort); reject(signal.reason); };
    signal.addEventListener('abort', abort, { once: true });
    promise.then(value => { signal.removeEventListener('abort', abort); resolve(value); }, error => { signal.removeEventListener('abort', abort); reject(error); });
  });
}

function normalizeRound(value: any, finish: unknown): Round {
  if (!value || (value.role !== undefined && value.role !== 'assistant') || (value.content != null && typeof value.content !== 'string') || (value.reasoning_content != null && typeof value.reasoning_content !== 'string')) throw invalid();
  if (finish !== 'stop' && finish !== 'tool_calls') throw invalid();
  if (value.tool_calls != null && !Array.isArray(value.tool_calls)) throw invalid();
  const calls: ToolCall[] = (value.tool_calls || []).map((call: any) => {
    if (!call || call.type !== 'function' || !hasText(call.id) || !hasText(call.function?.name) || typeof call.function?.arguments !== 'string') throw invalid();
    return { id: call.id, type: 'function', function: { name: call.function.name, arguments: call.function.arguments } };
  });
  if (new Set(calls.map(call => call.id)).size !== calls.length || (finish === 'tool_calls' ? !calls.length : calls.length || !hasText(value.content))) throw invalid();
  return { finish, message: { role: 'assistant', content: value.content ?? null, reasoning_content: value.reasoning_content ?? '', ...(calls.length ? { tool_calls: calls } : {}) } };
}

async function readRound(response: Response, signal: AbortSignal, progress: () => void, onText?: Options['onText']): Promise<Round> {
  if (!response.headers.get('content-type')?.includes('text/event-stream')) {
    let value: any;
    try { value = await abortable(response.json(), signal); }
    catch { signal.throwIfAborted(); throw invalid(); }
    const choice = value?.choices?.[0];
    if (value?.error || !choice || (choice.index !== undefined && choice.index !== 0)) throw invalid();
    const round = normalizeRound(choice.message, choice.finish_reason);
    if (hasText(round.message.reasoning_content) || hasText(round.message.content) || round.message.tool_calls?.length) progress();
    if (hasText(round.message.content)) onText?.(round.message.content);
    return round;
  }
  if (!response.body) throw invalid();
  const reader = response.body.getReader(); const decoder = new TextDecoder();
  let buffer = ''; let content: string | null = null; let reasoning = ''; let finish: string | null = null;
  const calls = new Map<number, ToolCall>();
  const abort = () => { void reader.cancel().catch(() => undefined); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    signal.throwIfAborted();
    for (;;) {
      const chunk = await abortable(reader.read(), signal); signal.throwIfAborted();
      if (chunk.done) throw invalid();
      buffer += decoder.decode(chunk.value, { stream: true });
      let boundary;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const part = buffer.slice(0, boundary.index); buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = part.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
        if (!data) continue;
        if (data === '[DONE]') {
          const ordered = [...calls].sort(([left], [right]) => left - right);
          if (ordered.some(([index], position) => index !== position)) throw invalid();
          return normalizeRound({ role: 'assistant', content, reasoning_content: reasoning, tool_calls: ordered.map(([, call]) => call) }, finish);
        }
        let value: any;
        try { value = JSON.parse(data); } catch { throw invalid(); }
        if (value?.error || !Array.isArray(value?.choices)) throw invalid();
        const choice = value.choices[0]; if (!choice) continue;
        if (choice.index !== undefined && choice.index !== 0) throw invalid();
        const delta = choice.delta || {};
        if (delta.role !== undefined && delta.role !== 'assistant') throw invalid();
        if ((delta.content != null && typeof delta.content !== 'string') || (delta.reasoning_content != null && typeof delta.reasoning_content !== 'string') || (delta.tool_calls != null && !Array.isArray(delta.tool_calls))) throw invalid();
        if (finish && (hasText(delta.content) || hasText(delta.reasoning_content) || delta.tool_calls?.length)) throw invalid();
        if (typeof delta.reasoning_content === 'string') { reasoning += delta.reasoning_content; if (hasText(delta.reasoning_content)) progress(); }
        if (typeof delta.content === 'string' && delta.content.length) { content = (content || '') + delta.content; if (hasText(delta.content)) progress(); onText?.(content); }
        for (const fragment of delta.tool_calls || []) {
          if (!Number.isInteger(fragment.index) || fragment.index < 0 || (fragment.type != null && fragment.type !== 'function')) throw invalid();
          const call = calls.get(fragment.index) || { id: '', type: 'function' as const, function: { name: '', arguments: '' } };
          for (const [key, target] of [['id', call], ['name', call.function], ['arguments', call.function]] as const) {
            const piece = key === 'id' ? fragment.id : fragment.function?.[key];
            if (piece != null && typeof piece !== 'string') throw invalid();
            if (typeof piece === 'string') { (target as Record<string, string>)[key] += piece; if (hasText(piece)) progress(); }
          }
          calls.set(fragment.index, call);
        }
        if (choice.finish_reason != null) {
          if (finish || !['stop', 'tool_calls'].includes(choice.finish_reason)) throw invalid();
          finish = choice.finish_reason;
        }
      }
    }
  } finally {
    signal.removeEventListener('abort', abort);
    await reader.cancel().catch(() => undefined); reader.releaseLock();
  }
}

export async function deepseekToolAnswer(config: DeepSeekConfig, instruction: string, context: string, tools: AgentTool[], options: Options = {}): Promise<string> {
  const base = config.baseUrl.replace(/\/+$/, '');
  const endpoint = base.endsWith('/chat/completions') ? base : base + '/chat/completions';
  const timeout = new AbortController();
  const expire = () => timeout.abort(new DOMException('DeepSeek tool request timed out', 'TimeoutError'));
  let idleTimer = setTimeout(expire, DEEPSEEK_IDLE_TIMEOUT_MS);
  const maximumTimer = setTimeout(expire, DEEPSEEK_MAX_DURATION_MS);
  const progress = () => { clearTimeout(idleTimer); idleTimer = setTimeout(expire, DEEPSEEK_IDLE_TIMEOUT_MS); };
  const signal = options.signal ? AbortSignal.any([timeout.signal, options.signal]) : timeout.signal;
  const messages: Message[] = [{ role: 'system', content: instruction }, { role: 'user', content: context }];
  const allowed = new Map(tools.map(tool => [tool.name, tool]));
  const definitions = tools.map(tool => ({ type: 'function', function: { name: tool.name, description: tool.description, parameters: tool.parameters } }));
  let callCount = 0;
  try {
    for (let roundIndex = 0; roundIndex < 8; roundIndex++) {
      signal.throwIfAborted();
      const response = await abortable(fetch(endpoint, { method: 'POST', redirect: 'error', signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify({ model: config.name, stream: true, thinking: { type: 'enabled' }, reasoning_effort: 'high', max_tokens: 32768, tools: definitions, messages }) }), signal);
      signal.throwIfAborted();
      if (!response.ok) {
        await response.body?.cancel();
        throw new ApiError(`DeepSeek 服务返回 HTTP ${response.status}；请检查服务端模型配置后重试。`, response.status === 401 || response.status === 403 ? 503 : 502, 'MODEL_HTTP_ERROR');
      }
      const round = await readRound(response, signal, progress, options.onText);
      signal.throwIfAborted();
      if (round.finish === 'stop') return round.message.content!;
      const calls = round.message.tool_calls!;
      if (callCount + calls.length > 24 || roundIndex === 7) throw limit();
      // DeepSeek thinking-mode tool calls require the complete assistant reasoning in every follow-up request.
      // Keep it only in this server-side conversation; never send it to UI callbacks or logs.
      messages.push(round.message); callCount += calls.length;
      for (const call of calls) {
        signal.throwIfAborted();
        const tool = allowed.get(call.function.name);
        let value: unknown;
        if (!tool) value = { error: { code: 'UNKNOWN_TOOL', message: '未提供该工具，请从本次声明的工具中选择。' } };
        else {
          let args: unknown; let validArgs = true;
          try { args = JSON.parse(call.function.arguments); }
          catch { validArgs = false; value = { error: { code: 'INVALID_TOOL_ARGUMENTS', message: '工具参数不是完整有效的JSON，请根据工具定义修正后再调用。' } }; }
          if (validArgs) {
            options.onTool?.(tool.name); signal.throwIfAborted();
            try { value = await abortable(Promise.resolve().then(() => tool.execute(args, signal)), signal); }
            catch (error) {
              signal.throwIfAborted();
              value = { error: error instanceof ApiError ? { code: error.code, message: error.message } : { code: 'TOOL_EXECUTION_FAILED', message: '工具执行失败，请检查参数或选择其他可用案例后重试。' } };
            }
          }
        }
        signal.throwIfAborted(); progress();
        let content: string;
        try { content = typeof value === 'string' ? value : JSON.stringify(value ?? null); }
        catch { content = JSON.stringify({ error: { code: 'TOOL_EXECUTION_FAILED', message: '工具结果无法序列化，请调整参数后重试。' } }); }
        messages.push({ role: 'tool', tool_call_id: call.id, content });
      }
    }
    throw limit();
  } catch (error) {
    if (options.signal?.aborted) throw options.signal.reason;
    if (timeout.signal.aborted) throw new ApiError('DeepSeek 思考、检索或生成耗时较长，请求已超时；已保留输入和选择，请重试。', 504, 'MODEL_TIMEOUT');
    if (error instanceof ApiError) throw error;
    throw new ApiError('DeepSeek 服务暂时无法连接或连接中断；已保留输入和选择，请重试。', 502, 'MODEL_UNAVAILABLE');
  } finally {
    clearTimeout(idleTimer); clearTimeout(maximumTimer);
  }
}
