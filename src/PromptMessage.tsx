import { ArrowDownToLine, Copy } from 'lucide-react';
import { PROMPT_PREFIX } from './requirements';

export { PROMPT_PREFIX } from './requirements';
export default function PromptMessage({ content, onNotice }: { content: string; onNotice: (value: string) => void }) {
  const prompt = content.slice(PROMPT_PREFIX.length);
  async function copy() { try { await navigator.clipboard.writeText(prompt); onNotice('已复制，可交给其他模型实现页面'); } catch { onNotice('剪贴板不可用，请在提示词框中全选复制'); } }
  function download() { const url = URL.createObjectURL(new Blob([prompt], { type: 'text/markdown;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = '见意-专业开发提示词.md'; anchor.click(); URL.revokeObjectURL(url); }
  return <div className="prompt-message"><p>专业开发提示词已生成，可交给其他模型实现页面。</p><textarea readOnly aria-label="完整专业开发提示词" rows={10} value={prompt} onFocus={event => event.target.select()} /><div className="prompt-message-actions"><button className="button secondary" onClick={() => void copy()}><Copy size={13} />复制提示词</button><button className="button secondary" onClick={download}><ArrowDownToLine size={13} />下载提示词</button></div></div>;
}
