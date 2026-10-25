import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { load } from 'cheerio';

const catalog = JSON.parse(await fs.readFile('data/catalog.json', 'utf8'));
const directoryUrl = 'https://ui.aceternity.com/ai-recommendations';
const directoryResponse = await fetch(directoryUrl, { signal: AbortSignal.timeout(30000) });
if (!directoryResponse.ok) throw new Error(`Directory returned ${directoryResponse.status}`);
const directoryHtml = await directoryResponse.text();
const directoryPage = load(directoryHtml);
const directoryRows = directoryPage('pre').toArray().flatMap(node => {
  try { const data = JSON.parse(directoryPage(node).text()); return Array.isArray(data) ? data : data.components || []; }
  catch { return []; }
});
const rowsByUrl = new Map(directoryRows.map(row => [row.documentationUrl, row]));
const targets = directoryRows.filter(row => row.isPro !== true && row.isTemplate !== true && typeof row.documentationUrl === 'string' && row.documentationUrl.startsWith('https://ui.aceternity.com/components/')).map(row => ({ sourceId: 'aceternity', sourceUrl: row.documentationUrl }));
targets.push(...catalog.filter(entry => entry.sourceId === '60fps'));
const replacements = {
  grid: 'grid-and-dot-backgrounds',
  'glowing-stars': 'glowing-stars-effect',
  'parallax-scroll-2': 'parallax-scroll',
  lamp: 'lamp-effect',
  '3d-card': '3d-card-effect',
  globe: 'github-globe',
  'shooting-stars': 'shooting-stars-and-stars-background',
  'stars-background': 'shooting-stars-and-stars-background',
  cover: 'container-cover',
  input: 'signup-form',
  label: 'signup-form',
};
const evidence = new Array(targets.length);
let next = 0;
async function worker() {
  while (next < targets.length) {
    const index = next++;
    const entry = targets[index];
    try {
      const response = await fetch(entry.sourceUrl, { signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      const page = load(html);
      page('script,style').remove();
      const headings = page('h1,h2,h3').toArray().map(node => page(node).text().trim()).filter(Boolean);
      const h1 = page('h1').first();
      const intro = h1.parent().text().replace(/\s+/g, ' ').trim().slice(0, 2200);
      const descriptions = page('main p').toArray().map(node => page(node).text().replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 12);
      const demos = page('iframe').toArray().map(node => page(node).attr('src')).filter(Boolean);
      const componentLinks = page('a[href]').toArray().map(node => ({ title: page(node).text().trim(), url: page(node).attr('href') })).filter(link => link.url?.startsWith('/components/'));
      const code = page('pre').toArray().map(node => page(node).text()).join('\n').slice(0, 14000);
      const slug = entry.sourceUrl.split('/').pop();
      let registry;
      if (entry.sourceId === 'aceternity') {
        const registryUrl = `https://ui.aceternity.com/registry/${slug}.json`;
        const registryResponse = await fetch(registryUrl, { signal: AbortSignal.timeout(30000) });
        if (registryResponse.ok) {
          const registryData = await registryResponse.json();
          registry = { url: registryUrl, status: registryResponse.status, name: registryData.name, files: (registryData.files || []).map(file => ({ path: file.path, bytes: Buffer.byteLength(file.content || ''), sha256: crypto.createHash('sha256').update(file.content || '').digest('hex'), content: file.content || '' })) };
        } else registry = { url: registryUrl, status: registryResponse.status };
      }
      let replacement;
      if (response.status === 404 && replacements[slug]) {
        const replacementUrl = `https://ui.aceternity.com/components/${replacements[slug]}`;
        const currentResponse = await fetch(replacementUrl, { signal: AbortSignal.timeout(30000) });
        const currentHtml = await currentResponse.text();
        const current = load(currentHtml); current('script,style').remove();
        replacement = { sourceUrl: replacementUrl, status: currentResponse.status, htmlSha256: crypto.createHash('sha256').update(currentHtml).digest('hex'), title: current('title').text(), headings: current('h1,h2,h3').toArray().map(node => current(node).text().trim()).filter(Boolean), intro: current('h1').first().parent().text().replace(/\s+/g, ' ').trim(), descriptions: current('main p').toArray().map(node => current(node).text().replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 12), codeExcerpt: current('pre').toArray().map(node => current(node).text()).join('\n').slice(0, 14000) };
      }
      evidence[index] = { sourceUrl: entry.sourceUrl, status: response.status, resolvedUrl: response.url, verifiedAt: new Date().toISOString(), htmlSha256: crypto.createHash('sha256').update(html).digest('hex'), title: page('title').text(), headings, intro, descriptions, demoFrames: demos, componentLinks, codeExcerpt: code, directory: rowsByUrl.get(entry.sourceUrl) || null, registry, replacement };
    } catch (error) {
      evidence[index] = { sourceUrl: entry.sourceUrl, verifiedAt: new Date().toISOString(), error: String(error), directory: rowsByUrl.get(entry.sourceUrl) || null };
    }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
await fs.mkdir('data/enrichment', { recursive: true });
await fs.writeFile('data/enrichment/aceternity.evidence.json', `${JSON.stringify({ directoryUrl, collectedAt: new Date().toISOString(), entries: evidence }, null, 2)}\n`);
console.log(JSON.stringify({ checked: evidence.length, ok: evidence.filter(row => row.status === 200).length, failures: evidence.filter(row => row.status !== 200).map(row => ({ url: row.sourceUrl, status: row.status, error: row.error })) }, null, 2));
