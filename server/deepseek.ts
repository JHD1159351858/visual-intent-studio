import { ApiError } from './core';

export interface DeepSeekConfig { provider: 'deepseek'; baseUrl: string; name: string; apiKey: string; }
export const DEEPSEEK_IDLE_TIMEOUT_MS = 300000;
export const DEEPSEEK_MAX_DURATION_MS = 600000;
const invalidResponse = () => new ApiError('DeepSeek 没有返回完整的生成结果；已保留输入和选择，请重试。', 502, 'MODEL_INVALID_RESPONSE');
const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export async function deepseekAnswer(config: DeepSeekConfig, instruction: string, context: string, options: { onText?: (content: string) => void; signal?: AbortSignal } = {}): Promise<string> {
  const base = config.baseUrl.replace(/\/+$/, '');
  const endpoint = base.endsWith('/chat/completions') ? base : base + '/chat/completions';
  const timeout = new AbortController();
  const expire = () => timeout.abort(new DOMException('DeepSeek request timed out', 'TimeoutError'));
  let idleTimer = setTimeout(expire, DEEPSEEK_IDLE_TIMEOUT_MS);
  const maximumTimer = setTimeout(expire, DEEPSEEK_MAX_DURATION_MS);
  const renewIdleTimeout = () => { clearTimeout(idleTimer); idleTimer = setTimeout(expire, DEEPSEEK_IDLE_TIMEOUT_MS); };
  const signal = options.signal ? AbortSignal.any([timeout.signal, options.signal]) : timeout.signal;
  try {
    signal.throwIfAborted();
    const response = await fetch(endpoint, { method: 'POST', redirect: 'error', signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify({ model: config.name, stream: true, thinking: { type: 'enabled' }, reasoning_effort: 'high', max_tokens: 32768, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: instruction }, { role: 'user', content: context }] }) });
    if (!response.ok) {
      await response.body?.cancel();
      throw new ApiError(`DeepSeek 服务返回 HTTP ${response.status}；请检查服务端密钥、模型名称和账户状态后重试。`, response.status === 401 || response.status === 403 ? 503 : 502, 'MODEL_HTTP_ERROR');
    }
    if (!response.headers.get('content-type')?.includes('text/event-stream')) {
      let value;
      try { value = await response.json(); } catch { throw invalidResponse(); }
      const choice = value?.choices?.[0];
      if (value?.error || choice?.finish_reason !== 'stop' || !hasText(choice.message?.content)) throw invalidResponse();
      options.onText?.(choice.message.content);
      return choice.message.content;
    }
    if (!response.body) throw invalidResponse();
    const reader = response.body.getReader(); const decoder = new TextDecoder();
    let buffer = ''; let content = ''; let finished = false;
    const abort = () => { void reader.cancel().catch(() => undefined); };
    signal.addEventListener('abort', abort, { once: true });
    try {
      signal.throwIfAborted();
      for (;;) {
        const chunk = await reader.read(); signal.throwIfAborted();
        if (chunk.done) throw invalidResponse();
        buffer += decoder.decode(chunk.value, { stream: true });
        let boundary;
        while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
          const part = buffer.slice(0, boundary.index); buffer = buffer.slice(boundary.index + boundary[0].length);
          const data = part.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
          if (!data) continue;
          if (data === '[DONE]') { if (!finished || !hasText(content)) throw invalidResponse(); return content; }
          let value;
          try { value = JSON.parse(data); } catch { throw invalidResponse(); }
          if (value?.error || !Array.isArray(value?.choices)) throw invalidResponse();
          const choice = value.choices[0]; if (!choice) continue;
          if (choice.index !== undefined && choice.index !== 0) throw invalidResponse();
          const delta = choice.delta;
          if (delta?.role && delta.role !== 'assistant') throw invalidResponse();
          if (hasText(delta?.reasoning_content) || hasText(delta?.content)) renewIdleTimeout();
          if (typeof delta?.content === 'string' && delta.content.length) {
            if (finished) throw invalidResponse();
            content += delta.content; options.onText?.(content);
          }
          if (choice.finish_reason != null) {
            if (choice.finish_reason !== 'stop') throw invalidResponse();
            finished = true;
          }
        }
      }
    } finally {
      signal.removeEventListener('abort', abort);
      await reader.cancel().catch(() => undefined); reader.releaseLock();
    }
  } catch (error) {
    if (signal.aborted && signal.reason?.name === 'TimeoutError') throw new ApiError('DeepSeek 思考或生成耗时较长，请求已超时；已保留输入和选择，请重试。', 504, 'MODEL_TIMEOUT');
    if (error instanceof ApiError) throw error;
    throw new ApiError('DeepSeek 服务暂时无法连接或连接中断；已保留输入和选择，请重试。', 502, 'MODEL_UNAVAILABLE');
  } finally {
    clearTimeout(idleTimer); clearTimeout(maximumTimer);
  }
}
