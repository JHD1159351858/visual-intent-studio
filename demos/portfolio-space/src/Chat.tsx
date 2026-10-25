import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, MessageCircle, Send, X } from 'lucide-react';
import './chat.css';

type ChatProps = { onContact: () => void; openSignal?: number };
type Message = { id: number; author: 'lin' | 'visitor'; text: string; contact?: boolean };

const questions = [
  { question: '你的工作经历是？', answer: '在这个演示设定里，我是产品设计师林知，关注从需求梳理、交互原型到界面交付的完整设计过程，也会与开发一起打磨细节。这里没有使用真实的公司或履历信息。' },
  { question: '你擅长什么技能？', answer: '我的演示技能方向包括用户体验设计、信息架构、交互原型、视觉界面与设计系统。常用工具是 Figma，也会用简单的前端原型验证想法。' },
  { question: '最近有什么项目？', answer: '可以先看看「轻康」健康管理 APP 与「形序」品牌视觉两个示例项目：前者探索如何让健康记录更轻松，后者从字形与秩序出发建立视觉语言。它们都是用于展示的概念作品。' },
];
const normalize = (value: string) => value.replace(/[\s，。！？、,.!?：:]/g, '').toLowerCase();

export default function Chat({ onContact, openSignal = 0 }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: 'lin', text: '你好，我是林知。这是预设问答演示，你可以从下面的问题开始了解我的设计方向。' },
  ]);
  const nextId = useRef(1);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (openSignal > 0) setIsOpen(true);
  }, [openSignal]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('dialog[open]')) {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    const match = questions.find((item) => normalize(item.question) === normalize(text));
    const visitorId = nextId.current++;
    const replyId = nextId.current++;
    setMessages((previous) => [
      ...previous,
      { id: visitorId, author: 'visitor', text },
      {
        id: replyId,
        author: 'lin',
        text: match?.answer ?? '当前为演示模式，可通过下方邮箱联系我',
        contact: !match,
      },
    ]);
    setDraft('');
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(draft);
  };

  return (
    <div className="s-chat">
      {isOpen && (
        <section className="s-chat-panel" id="portfolio-chat" role="region" aria-label="和我聊聊，预设问答演示">
          <header className="s-chat-header">
            <span className="s-chat-avatar" aria-hidden="true">LZ<span /></span>
            <div className="s-chat-heading"><h2>和我聊聊</h2><p>林知 · 产品设计师<span>预设问答</span></p></div>
            <button className="s-chat-icon-button" type="button" onClick={close} aria-label="关闭聊天"><X size={19} /></button>
          </header>
          <div className="s-chat-scroll" ref={scrollRef}>
            <p className="s-chat-caption">LET’S TALK DESIGN</p>
            <div className="s-chat-messages" role="log" aria-label="聊天记录" aria-live="polite" aria-relevant="additions">
              {messages.map((message) => (
                <div className={`s-chat-message s-chat-message--${message.author}`} key={message.id}>
                  {message.author === 'lin' && <span className="s-chat-sender">林知</span>}
                  <p>{message.text}</p>
                  {message.contact && <button className="s-chat-contact" type="button" onClick={() => { setIsOpen(false); onContact(); }}>查看演示联系方式<ArrowUpRight size={14} /></button>}
                </div>
              ))}
            </div>
            <div className="s-chat-questions" aria-label="常见问题">
              <p>从一个问题开始</p>
              {questions.map(({ question }) => <button key={question} type="button" onClick={() => ask(question)}>{question}<ArrowUpRight size={14} /></button>)}
            </div>
          </div>
          <form className="s-chat-form" onSubmit={submit}>
            <div className="s-chat-input-row">
              <label className="s-chat-sr" htmlFor="portfolio-chat-input">输入想了解的问题</label>
              <input id="portfolio-chat-input" ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入想了解的问题…" autoComplete="off" maxLength={500} />
              <button type="submit" aria-label="发送问题" disabled={!draft.trim()}><Send size={17} /></button>
            </div>
            <p>演示模式 · 不连接真实 AI 或后端服务</p>
          </form>
        </section>
      )}
      <button className={`s-chat-launcher${isOpen ? ' s-chat-launcher--open' : ''}`} type="button" ref={launcherRef} onClick={() => isOpen ? close() : setIsOpen(true)} aria-label={isOpen ? '关闭聊天' : '开启聊天'} aria-expanded={isOpen} aria-controls={isOpen ? 'portfolio-chat' : undefined}>
        {isOpen ? <X size={21} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
