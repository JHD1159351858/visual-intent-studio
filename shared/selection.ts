import type { Selection, VisualLayer } from './types';

export const visualLayers: VisualLayer[] = ['layout', 'surface', 'border', 'outer-glow', 'page-background', 'text', 'content'];

export function selectionLayer(selection: Selection): VisualLayer {
  if (selection.layer) return selection.layer;
  if (selection.entryId === 'aceternity-background-gradient') return 'border';
  return selection.stage === 'structure' ? 'layout' : selection.stage === 'style' ? 'surface' : 'content';
}

export function selectionTarget(selection: Selection): string {
  return selection.target?.trim() || (selection.stage === 'structure' ? 'page' : selection.placement.trim() || 'page');
}

export function selectionKey(selection: Selection): string {
  return JSON.stringify([selection.entryId, selectionTarget(selection), selectionLayer(selection)]);
}
