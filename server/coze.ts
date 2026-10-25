import { randomUUID } from 'node:crypto';
import { ApiError } from './core';

export interface CozeConfig { provider: 'coze'; baseUrl: string; name: string; apiKey: string; botId: string; }
export const COZE_TIMEOUT_MS = 300000;
export const COZE_MAX_DURATION_MS = 600000;
const invalidResponse = () => new ApiError('Coze 没有返回完整的对话结果；已保留输入，请重试。', 502, 'MODEL_INVALID_RESPONSE');
const requestFailed = () => new ApiError('Coze 请求失败；请检查密钥权限、智能体 ID 与 API 发布状态后重试。', 502, 'MODEL_COZE_ERROR');

export async function cozeAnswer(config: CozeConfig, content: string, options: { onText?: (content: string) => void; signal?: AbortSignal; timeoutMs?: number } = {}): Promise<string> {
  const base = config.baseUrl.replace(/\/+$/, '');
  const timeout = new AbortController();
  const expire = () => timeout.abort(new DOMException('Coze request timed out', 'TimeoutError'));
  let idleTimer = setTimeout(expire, COZE_TIMEOUT_MS);
  const maximumTimer = setTimeout(expire, options.timeoutMs ?? COZE_MAX_DURATION_MS);
  const renewIdleTimeout = () => { clearTimeout(idleTimer); idleTimer = setTimeout(expire, COZE_TIMEOUT_MS); };
  const signal = options.signal ? AbortSignal.any([timeout.signal, options.signal]) : timeout.signal;
  try {
    const response = await fetch(base + '/v3/chat', { method: 'POST', signal, redirect: 'error', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify({ bot_id: config.botId, user_id: randomUUID(), stream: true, auto_save_history: true, additional_messages: [{ role: 'user', type: 'question', content_type: 'text', content }] }) });
    if (!response.ok) {
      await response.body?.cancel();
      throw new ApiError(`Coze 服务返回 HTTP ${response.status}；请检查密钥权限和智能体发布状态后重试。`, response.status === 401 || response.status === 403 ? 503 : 502, 'MODEL_HTTP_ERROR');
    }
    if (!response.headers.get('content-type')?.includes('text/event-stream')) {
      let value;
      try { value = await response.json(); } catch { throw invalidResponse(); }
      if (value && typeof value.code === 'number' && value.code !== 0) throw requestFailed();
      throw invalidResponse();
    }
    if (!response.body) throw invalidResponse();
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ''; let answer: string | undefined; let partial = ''; let messageId: string | undefined;
    const abort = () => { void reader.cancel().catch(() => undefined); };
    signal.addEventListener('abort', abort, { once: true });
    try {
      signal.throwIfAborted();
      for (;;) {
        const chunk = await reader.read();
        signal.throwIfAborted();
        if (chunk.done) throw invalidResponse();
        buffer += decoder.decode(chunk.value, { stream: true });
        let boundary;
        while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
          const lines = buffer.slice(0, boundary.index).split(/\r?\n/);
          buffer = buffer.slice(boundary.index + boundary[0].length);
          const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim();
          if (event === 'error') throw requestFailed();
          if (event === 'conversation.chat.requires_action') throw new ApiError('Coze 智能体需要端插件或额外操作；当前工作台不支持此步骤，请改用直接返回 JSON 的智能体。', 502, 'MODEL_COZE_REQUIRES_ACTION');
          if (event === 'conversation.chat.failed' || event === 'conversation.chat.canceled') throw new ApiError('Coze 对话失败或已取消；已保留输入和选择，请重试。', 502, 'MODEL_COZE_FAILED');
          if (event === 'conversation.chat.completed') {
            if (typeof answer !== 'string') throw invalidResponse();
            return answer;
          }
          if (event === 'conversation.message.delta' || event === 'conversation.message.completed') {
            let message;
            try { message = JSON.parse(lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n')); } catch { throw invalidResponse(); }
            const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
            if (message?.role === 'assistant' && (hasText(message.reasoning_content) || hasText(message.reasoning) || ((message.type === 'reasoning' || message.type === 'reasoning_content' || (message.type === 'answer' && message.content_type === 'text')) && hasText(message.content)))) renewIdleTimeout();
            if (message?.role === 'assistant' && message.type === 'answer' && message.content_type === 'text' && typeof message.content === 'string' && message.content.length > 0) {
              if (message.id && message.id !== messageId) { partial = ''; messageId = message.id; }
              if (event === 'conversation.message.delta') partial += message.content;
              else { answer = message.content; partial = message.content; }
              options.onText?.(partial);
            }
          }
        }
      }
    } finally {
      signal.removeEventListener('abort', abort);
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  } catch (error) {
    if (signal.aborted && signal.reason?.name === 'TimeoutError') throw new ApiError('Coze 深度思考或生成耗时较长，请求已超时；已保留输入和选择，请重试。', 504, 'MODEL_TIMEOUT');
    if (error instanceof ApiError) throw error;
    throw new ApiError('Coze 服务暂时无法连接或连接中断；已保留输入和选择，请重试。', 502, 'MODEL_UNAVAILABLE');
  } finally {
    clearTimeout(idleTimer);
    clearTimeout(maximumTimer);
  }
}
