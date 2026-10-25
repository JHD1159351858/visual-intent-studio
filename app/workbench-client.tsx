'use client';

import { useEffect, useState } from 'react';
import App from '../src/App';

export default function WorkbenchClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? <App /> : <main className="app-shell" aria-busy="true"><p role="status">正在载入工作台…</p></main>;
}
