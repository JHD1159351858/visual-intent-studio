import { afterEach, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

afterEach(() => vi.unstubAllGlobals());

it('renders a stable Next shell without reading or overwriting browser drafts before mount', async () => {
  const getItem = vi.fn(() => { throw Error('Browser storage must only be read after client mount'); });
  const setItem = vi.fn();
  vi.stubGlobal('localStorage', { getItem, setItem });
  const { default: WorkbenchClient } = await import('../app/workbench-client');
  const first = renderToString(createElement(WorkbenchClient));
  const second = renderToString(createElement(WorkbenchClient));
  expect(first).toContain('正在载入工作台');
  expect(first).toContain('aria-busy="true"');
  expect(second).toBe(first);
  expect(getItem).not.toHaveBeenCalled();
  expect(setItem).not.toHaveBeenCalled();
});
