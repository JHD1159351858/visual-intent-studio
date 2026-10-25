import { describe, expect, it } from 'vitest';
import { createSession, restoreSession, saveSession, confirmSelection, removeSelection, exportPayload } from '../src/session';
import type { Selection } from '../shared/types';

const choice = (entryId: string, stage: Selection['stage']): Selection => ({ entryId, stage, placement: '首页', adjustments: '减少动效' });

describe('browser draft and confirmed choices', () => {
  it('saves and restores the complete working context', () => {
    const session = { ...createSession(), brief: '做一个作品集', stage: 'style' as const, messages: [{ role: 'user' as const, content: '更克制一些' }], selections: [choice('a', 'structure')] };
    let saved = '';
    saveSession({ setItem: (_key, value) => { saved = value; } }, session);
    expect(restoreSession(saved)).toEqual(session);
  });

  it('recovers from malformed or incompatible stored state', () => {
    for (const value of ['{', '{"stage":"other"}', '{"brief":"x","stage":"style","messages":[],"selections":[{}]}']) {
      expect(restoreSession(value)).toEqual(createSession());
    }
  });

  it('replaces structure and style while keeping several effects', () => {
    let items = confirmSelection([choice('old', 'structure'), choice('style', 'style')], choice('new', 'structure'));
    items = confirmSelection(items, choice('e1', 'effect'));
    items = confirmSelection(items, choice('e2', 'effect'));
    items = confirmSelection(items, { ...choice('e1', 'effect'), adjustments: '只在滚动时触发' });
    expect(items.map(item => item.entryId)).toEqual(['style', 'new', 'e1', 'e2']);
    expect(items.find(item => item.entryId === 'e1')?.adjustments).toBe('只在滚动时触发');
  });

  it('removes a choice and exports only remaining confirmed choices', () => {
    const session = { ...createSession(), brief: '作品集', selections: removeSelection([choice('a', 'structure'), choice('b', 'effect')], 'b') };
    expect(exportPayload(session)).toEqual({ brief: '作品集', selections: [choice('a', 'structure')] });
    expect(exportPayload(createSession()).selections).toEqual([]);
  });

  it('keeps an existing glass surface when a gradient border is added', () => {
    const glass = choice('reactbits-glass-surface', 'style');
    const border: Selection = { ...choice('aceternity-background-gradient', 'style'), target: 'feature-card', layer: 'border', operation: 'add', preserve: ['磨砂玻璃内部'] };
    expect(confirmSelection([glass], border)).toEqual([glass, border]);
  });

  it('replaces only the requested target and layer', () => {
    const glass: Selection = { ...choice('glass', 'style'), target: 'feature-card', layer: 'surface' };
    const border: Selection = { ...choice('gradient', 'style'), target: 'feature-card', layer: 'border' };
    const other: Selection = { ...choice('other', 'style'), target: 'secondary-card', layer: 'surface' };
    const replacement: Selection = { ...choice('new', 'style'), target: 'feature-card', layer: 'surface', operation: 'replace' };
    expect(confirmSelection([glass, border, other], replacement)).toEqual([border, other, replacement]);
  });

  it('keeps separate applications of one reference and removes only one target', () => {
    const first: Selection = { ...choice('gradient', 'style'), target: 'card', layer: 'border' };
    const second: Selection = { ...first, target: 'button' };
    const items = confirmSelection([first], second);
    expect(items).toEqual([first, second]);
    expect(removeSelection(items, 'gradient', 'button', 'border')).toEqual([first]);
  });

  it('exports later user adjustments along with confirmed choices', () => {
    const session = { ...createSession(), brief: '做一个工具页', messages: [{role: 'user' as const, content: '保留玻璃，只改边缘'}], selections: [choice('glass', 'style')] };
    expect(exportPayload(session)).toMatchObject({messages: session.messages});
  });
});
