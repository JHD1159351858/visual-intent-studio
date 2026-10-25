import { useEffect, useRef, useState } from 'react';
import { ArrowUp, MessageCircle, Minus, X } from 'lucide-react';
import './chat.css';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  contact?: boolean;
};

const faqs = [
  { question: '你有多少年工作经验？', answer: '我有 5 年产品与交互设计经验：2021–2024 年担任产品设计师，2024 年至今独立工作，主要服务工具类产品、消费品牌和成长型团队。这份作品集中的人物经历与项目成果都是演示数据。' },
  { question: '你接 freelance 吗？', answer: '接的。演示中的我会承接产品体验、网站设计与品牌数字体验项目，偏好能够一起梳理问题、持续迭代的合作。你可以通过联系入口发来项目背景。' },
  { question: '你之前的项目负责什么内容？', answer: '以「步程」为例，我负责用户访谈、体验策略、信息架构、交互原型与视觉设计，并与开发协作完成上线。这里的职责、下载量与成效均为虚构演示。' },
  { question: '你的设计流程是什么？', answer: '先理解业务与用户，再定义关键问题；接着用低保真原型验证流程、建立视觉方向，最后交付组件与标注，并通过测试和数据持续迭代。' },
  { question: '你现在可以开始合作吗？', answer: '演示档期：可从下个月开始，每周投入 2–3 天。具体范围、排期与费用需要通过邮箱进一步沟通；这里的档期只是预设内容。' },
  { question: '你擅长哪些工具和技能？', answer: '主要使用 Figma、FigJam、Adobe Illustrator，也会用 React 与 Tailwind CSS 制作交互原型。我的关注点是用户研究、交互逻辑、设计系统与细节体验。' },
  { question: '你的教育背景是什么？', answer: '演示教育经历：2017–2021 年就读视觉传达设计专业，获得学士学位。人物、就读经历与毕业年份均用于本页面演示。' },
  { question: '你希望怎样的合作方式？', answer: '我喜欢目标明确、反馈坦诚的协作：启动时对齐范围与目标，每周同步进展，在关键节点一起评审。可以按项目合作，也可以作为团队的外部设计伙伴。' },
  { question: '可以介绍一下你的设计理念吗？', answer: '让复杂的事情更容易理解，也让熟悉的日常多一点值得记住的细节。先把核心任务做好，再用克制的视觉与动效建立产品的个性。' },
  { question: '怎么联系你？', answer: '点击下方联系入口，可以查看演示邮箱与微信展示位。联系方式均为占位演示，微信展示位不能用于扫码联系，请在正式使用前替换。', contact: true },
];

const fallback = '抱歉，我现在只能回答预设的问题，你可以直接通过邮箱联系我哦';
const normalize = (value: string) => value.trim().toLowerCase().replace(/[\s？?。！!，,、：:；;]/g, '');

export default function ChatWidget({ onContact }: { onContact: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', text: '你好，我是知夏的作品集小助手。想了解我的经历或合作方式？选一个问题，聊聊看。\n\n这里的个人资料、项目与回答均为预设演示内容。' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const dismiss = () => {
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('dialog[open]')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages, isOpen]);

  const send = (question: string) => {
    const value = question.trim();
    if (!value) return;
    const match = faqs.find((faq) => normalize(faq.question) === normalize(value));
    setMessages((previous) => [...previous,
      { id: nextId.current++, role: 'user', text: value },
      { id: nextId.current++, role: 'assistant', text: match?.answer ?? fallback, contact: match?.contact || !match },
    ]);
    setDraft('');
  };

  return (
    <div className={`chat-widget${isOpen ? ' chat-widget-open' : ''}`}>
      {isOpen && (
        <section className="chat-window" role="dialog" aria-label="和我聊聊" aria-describedby="chat-demo-status">
          <header className="chat-header">
            <div className="chat-header-title">
              <span className="chat-status-dot" aria-hidden="true" />
              <div><h2>和我聊聊</h2><p id="chat-demo-status">预设回复 · 演示</p></div>
            </div>
            <div className="chat-header-actions">
              <button type="button" className="chat-icon-button" onClick={dismiss} aria-label="最小化聊天窗口"><Minus size={17} /></button>
              <button type="button" className="chat-icon-button" onClick={dismiss} aria-label="关闭聊天窗口"><X size={18} /></button>
            </div>
          </header>

          <div className="chat-suggestions" aria-label="常见问题">
            <p>从一个问题开始 <span>左右滑动查看更多</span></p>
            <div className="chat-faq-list">
              {faqs.map((faq) => <button type="button" key={faq.question} onClick={() => send(faq.question)}>{faq.question}</button>)}
            </div>
          </div>

          <div className="chat-conversation" ref={conversationRef} role="log" aria-live="polite" aria-relevant="additions" aria-label="聊天记录">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message chat-message-${message.role}`}>
                {message.role === 'assistant' && <span className="chat-message-author">知夏 / 演示</span>}
                <p>{message.text}</p>
                {message.contact && <button type="button" className="chat-contact" onClick={onContact}>查看联系方式 <span aria-hidden="true">↗</span></button>}
              </div>
            ))}
          </div>

          <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
            <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="输入你的问题" placeholder="输入问题，或选择上方问题…" autoComplete="off" />
            <button type="submit" aria-label="发送消息" disabled={!draft.trim()}><ArrowUp size={18} strokeWidth={2} /></button>
          </form>
        </section>
      )}
      <button ref={launcherRef} className="chat-launcher" type="button" onClick={() => isOpen ? dismiss() : setIsOpen(true)} aria-label={isOpen ? '最小化聊天窗口' : '和我聊聊'} aria-expanded={isOpen}>
        {isOpen ? <X size={24} /> : <MessageCircle size={25} strokeWidth={1.7} />}
        {!isOpen && <span className="chat-launcher-tooltip">和我聊聊</span>}
      </button>
    </div>
  );
}
