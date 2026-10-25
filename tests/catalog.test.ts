import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CatalogEntry } from '../shared/types';

const entries = JSON.parse(readFileSync(resolve('data/catalog.seed.json'), 'utf8')) as CatalogEntry[];
const references = entries.filter(entry => entry.preview.provenance === 'reference-recording');

describe('source-backed starter catalog', () => {
  it('publishes exactly 350 verified playable cases for the first release', () => {
    const playable = entries.filter(entry => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified);
    expect(playable.length).toBe(350);
    const release = JSON.parse(readFileSync(resolve('data/catalog.release.v1.json'), 'utf8'));
    expect(release.playableCount).toBe(350);
    expect(release.entryIds).toEqual(playable.map(entry => entry.id));
  });

  it('provides at least four distinct cases for each decision stage', () => {
    expect(entries.length).toBeGreaterThanOrEqual(12);
    expect(new Set(entries.map(entry => entry.id)).size).toBe(entries.length);
    for (const stage of ['structure', 'style', 'effect']) {
      expect(entries.filter(entry => entry.stage === stage).length).toBeGreaterThanOrEqual(4);
    }
  });

  it('keeps source traceability and explicit recording provenance', () => {
    for (const entry of references) {
      expect(entry.name.length).toBeGreaterThan(3);
      expect(entry.title.length).toBeGreaterThan(3);
      expect(entry.aliases.length).toBeGreaterThan(0);
      expect(entry.placements.length).toBeGreaterThan(0);
      expect(entry.trigger.length).toBeGreaterThan(3);
      const source = new URL(entry.sourceUrl);
      expect(['ui.aceternity.com', 'reactbits.dev']).toContain(source.hostname);
      expect(entry.implementationUrl).toMatch(/^https:\/\//);
      expect(entry.preview.provenance).toBe('reference-recording');
      expect(entry.preview.note).toContain('非原站录像');
      expect(entry.updatedAt).toMatch(/^2026-10-12/);
    }
  });

  it('only labels locally available recordings ready and verified', () => {
    const recordings = JSON.parse(readFileSync(resolve('media/verification.json'), 'utf8')) as { id: string; duration: number; width: number; height: number; currentTime: number }[];
    for (const entry of references) {
      expect(entry.status).toBe('ready');
      expect(entry.preview.type).toBe('video');
      expect(entry.preview.verified).toBe(true);
      expect(entry.preview.url).toBe(`/media/${entry.id}.webm`);
      const videoPath = resolve(`.${entry.preview.url}`);
      expect(existsSync(videoPath), entry.id).toBe(true);
      expect(statSync(videoPath).size, entry.id).toBeGreaterThan(5000);
      expect(existsSync(resolve(`demos/${entry.id}.html`))).toBe(true);
      expect(existsSync(resolve(`media/${entry.id}.png`))).toBe(true);
      const playback = recordings.find(recording => recording.id === entry.id);
      expect(playback?.duration, entry.id).toBeGreaterThan(0);
      expect(playback?.width, entry.id).toBe(960);
      expect(playback?.height, entry.id).toBe(600);
      expect(playback?.currentTime, entry.id).toBeGreaterThan(0);
    }
  });

  it('ships complete Chinese discovery metadata for the collected public libraries', () => {
    expect(entries.length).toBeGreaterThanOrEqual(280);
    for (const entry of entries) {
      expect(entry.title, entry.id).toMatch(/[\u4e00-\u9fff]/);
      expect(entry.description, entry.id).toMatch(/[\u4e00-\u9fff]/);
      expect(entry.description.length, entry.id).toBeGreaterThan(15);
      expect(entry.aliases.length, entry.id).toBeGreaterThanOrEqual(2);
      expect(entry.placements.length, entry.id).toBeGreaterThan(0);
      expect(entry.tags.length, entry.id).toBeGreaterThan(0);
      expect(entry.curation?.reviewedAt, entry.id).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(entry.curation?.evidenceUrl, entry.id).toMatch(/^https:\/\//);
    }
  });

  it('ties each local source video to an actual decoded capture and never labels a failure ready', () => {
    const manifest = JSON.parse(readFileSync(resolve('data/preview-captures.json'), 'utf8'));
    for (const entry of entries) {
      if (entry.preview.url.startsWith('/media/sources/')) {
        const recording = manifest.captures.find((capture: { entryId: string }) => capture.entryId === entry.id);
        expect(recording?.verified, entry.id).toBe(true);
        expect(recording?.url, entry.id).toBe(entry.preview.url);
        expect(recording?.provenance, entry.id).toBe(entry.preview.provenance);
        expect(recording?.playback.currentTime, entry.id).toBeGreaterThan(0);
        expect(recording?.playback.duration, entry.id).toBeGreaterThan(0);
        expect(recording?.demoSelector, entry.id).toBeTruthy();
        expect(existsSync(resolve('.' + entry.preview.url)), entry.id).toBe(true);
        expect(existsSync(resolve('.' + entry.preview.poster!)), entry.id).toBe(true);
        expect(entry.status, entry.id).toBe('ready');
      }
      if (entry.status === 'draft') {
        expect(entry.preview.verified, entry.id).toBe(false);
        expect(entry.preview.note, entry.id).toBeTruthy();
      }
    }
  });
});
