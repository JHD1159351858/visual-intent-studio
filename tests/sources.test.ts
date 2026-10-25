import { describe, it, expect, vi } from 'vitest';
import { assertSourceUrl, importSource, parseAceternity, parseReactBits, parseCasePage } from '../server/sources';
import * as enrichment from '../server/enrichment';
describe('source network boundary', () => {
  it('accepts preset HTTPS source hosts', () => { expect(assertSourceUrl('https://www.reactbits.dev/get-started/index')).toBe('reactbits'); });
  it('rejects private, arbitrary, insecure, credential-bearing URLs and custom ports', () => {
    for (const url of ['http://ui.aceternity.com/x', 'https://127.0.0.1/a', 'https://example.com', 'https://ui.aceternity.com.evil.test', 'https://u:p@ui.aceternity.com', 'https://ui.aceternity.com:8443']) expect(() => assertSourceUrl(url)).toThrow();
  });
});
describe('source extraction', () => {
  it('does not treat a related case title containing Code as a source code link', () => {
    const result = parseCasePage('<h1>Opal Border Glow</h1><a href="./opal-code-copied-text-pop-interaction">Opal Code Copied Text Pop Interaction</a><a href="./demo-related-animation">Related demo animation</a>', 'https://60fps.design/shots/opal-border-glow');
    expect(result.implementationUrl).toBeUndefined();
  });
  it('prefers primary VideoObject JSON-LD content and thumbnail over related DOM videos', () => {
    const result = parseCasePage('<h1>Primary Shot</h1><script type="application/ld+json">{"@context":"https://schema.org","@type":"VideoObject","name":"Primary Shot","contentUrl":"https://video.gumlet.io/primary/main.mp4","thumbnailUrl":"https://video.gumlet.io/primary/poster.png"}</script><video src="https://video.gumlet.io/related/main.mp4"></video>', 'https://60fps.design/shots/primary');
    expect(result.preview).toMatchObject({ type: 'video', url: 'https://video.gumlet.io/primary/main.mp4', poster: 'https://video.gumlet.io/primary/poster.png', verified: false });
  });
  it('imports free Aceternity JSON components and never pro components', () => {
    const html = `<pre><code>${JSON.stringify({ components: [{ name: 'Free Card', slug: 'free-card', description: 'Hover motion', url: 'https://ui.aceternity.com/components/free-card' }], proComponents: [{ name: 'Paid', url: 'https://ui.aceternity.com/components/paid' }] })}</code></pre>`;
    const result = parseAceternity(html);
    expect(result.map(e => e.name)).toEqual(['Free Card']);
    expect(result[0]).toMatchObject({ status: 'draft', sourceId: 'aceternity', preview: { type: 'link', verified: false } });
  });
  it('deduplicates ReactBits official navigation components and drops unrelated links', () => {
    const result = parseReactBits('<a href="/text-animations/blur-text">Blur Text</a><a href="/text-animations/blur-text">Blur Text</a><a href="/get-started/installation">Install</a><a href="https://evil.test/x">Other</a>');
    expect(result).toHaveLength(1);
    expect(result[0].sourceUrl).toBe('https://reactbits.dev/text-animations/blur-text');
  });
  it('imports official Micro interactions without accepting nested, paid or external routes', () => {
    const result = parseReactBits('<a href="/micro/hold-button">Hold Button</a><a href="https://www.reactbits.dev/micro/hold-button/">Hold Button</a><a href="/micro/spring-check">Spring Check</a><a href="/micro/hold-button/details">Nested</a><a href="https://pro.reactbits.dev/micro/hold-button">Paid</a><a href="https://example.com/micro/hold-button">External</a>');
    expect(result.map(entry => entry.sourceUrl)).toEqual(['https://reactbits.dev/micro/hold-button', 'https://reactbits.dev/micro/spring-check']);
    expect(result.every(entry => entry.tags.includes('micro') && entry.status === 'draft' && entry.preview.verified === false)).toBe(true);
  });
  it('extracts a case title description canonical direct video and code links but leaves it draft', () => {
    const result = parseCasePage('<title>Fallback</title><h1>Hover trail</h1><meta name="description" content="A pointer animation"><link rel="canonical" href="https://tympanus.net/codrops/2026/10/01/trail/"><video><source src="/media/trail.mp4" type="video/mp4"></video><a href="https://github.com/codrops/trail">Code</a>', 'https://tympanus.net/codrops/2026/10/01/trail/?utm_source=x');
    expect(result).toMatchObject({ name: 'Hover trail', description: 'A pointer animation', sourceId: 'codrops', sourceUrl: 'https://tympanus.net/codrops/2026/10/01/trail', implementationUrl: 'https://github.com/codrops/trail', status: 'draft', preview: { type: 'video', url: 'https://tympanus.net/media/trail.mp4', verified: false } });
  });
});

describe('verified legacy source resolution', () => {
  it.each([
    ['grid', 'grid-and-dot-backgrounds'],
    ['input', 'signup-form'],
    ['label', 'signup-form'],
  ])('fetches the verified current URL before importing %s', async (legacy, current) => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<h1>Current component</h1>', { headers: { 'content-type': 'text/html' } }));
    try {
      const result = await importSource(`https://ui.aceternity.com/components/${legacy}`);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`https://ui.aceternity.com/components/${current}`, expect.objectContaining({ redirect: 'manual' }));
      expect(result.sourceUrl).toBe(`https://ui.aceternity.com/components/${current}`);
    } finally { fetch.mockRestore(); }
  });
  it('imports Moving Line through its verified public registry JSON', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ name: 'moving-line', type: 'registry:ui', files: [{ path: 'components/ui/moving-line.tsx', content: 'export const MovingLine = () => null;' }] }), { headers: { 'content-type': 'application/json' } }));
    try {
      const result = await importSource('https://ui.aceternity.com/components/moving-line');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://ui.aceternity.com/registry/moving-line.json', expect.anything());
      expect(result.sourceUrl).toBe('https://ui.aceternity.com/registry/moving-line.json');
      expect(result.preview).toMatchObject({ type: 'link', verified: false });
      expect(result.curation).toBeDefined();
    } finally { fetch.mockRestore(); }
  });
  it.each(['https://127.0.0.1/private', 'https://reactbits.dev/components/tilted-card', 'https://ui.aceternity.com:8443/private'])('blocks a resolved URL outside the original source boundary: %s', async resolvedSourceUrl => {
    const rows = new Map([['https://ui.aceternity.com/components/legacy', { title: 'Test', description: 'Test', aliases: [], trigger: '', placements: [], tags: [], stage: 'effect' as const, reviewedAt: '', resolvedSourceUrl }]]);
    const resolver = vi.spyOn(enrichment, 'loadCurations').mockResolvedValue(rows);
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('<h1>Unexpected request</h1>', { headers: { 'content-type': 'text/html' } }));
    try {
      await expect(importSource('https://ui.aceternity.com/components/legacy')).rejects.toThrow();
      expect(fetch).not.toHaveBeenCalled();
    } finally { resolver.mockRestore(); fetch.mockRestore(); }
  });
});

it('rejects arbitrary redirect targets before issuing a second network request', async () => {
  const { vi } = await import('vitest');
  const { fetchSource } = await import('../server/sources');
  const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 302, headers: { location: 'https://127.0.0.1/private' } }));
  try {
    await expect(fetchSource('https://ui.aceternity.com/components/grid')).rejects.toThrow(/预设/);
    expect(fetch).toHaveBeenCalledTimes(1);
  } finally { fetch.mockRestore(); }
});
it('imports only free component rows from mixed live-format JSON arrays', () => {
  const html = `<pre>${JSON.stringify([{ name: 'free', title: 'Free', documentationUrl: 'https://ui.aceternity.com/components/free', isPro: false }, { name: 'paid', documentationUrl: 'https://ui.aceternity.com/components/paid', isPro: true }, { title: 'Pro block without flag', documentationUrl: 'https://ui.aceternity.com/blocks/test' }])}</pre>`;
  expect(parseAceternity(html).map(entry => entry.name)).toEqual(['Free']);
});

it('allows the observed 60fps media CDN for verification only and blocks unrelated media redirects', async () => {
  const { vi } = await import('vitest');
  const sourceModule = await import('../server/sources');
  expect(() => assertSourceUrl('https://video.gumlet.io/example/main.mp4')).toThrow();
  const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200, headers: { 'content-type': 'video/mp4' } }));
  try {
    const response = await sourceModule.fetchMedia('https://video.gumlet.io/example/main.mp4', 'HEAD');
    expect(response.headers.get('content-type')).toBe('video/mp4');
    expect(fetch.mock.calls[0][1]?.method).toBe('HEAD');
    fetch.mockClear();
    fetch.mockResolvedValue(new Response(null, { status: 302, headers: { location: 'https://localhost/private' } }));
    await expect(sourceModule.fetchMedia('https://video.gumlet.io/example/main.mp4', 'HEAD')).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(1);
  } finally { fetch.mockRestore(); }
});
