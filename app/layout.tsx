import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../src/styles.css';

export const metadata: Metadata = { title: '见意 · 视觉需求工作台' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f4f6f8' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN"><body><div id="root">{children}</div></body></html>;
}
