import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const width = 96;
const height = 60;
const pixels = width * height;
const round = value => Number(value.toFixed(4));

// Detect the recorder's grey padding, not normal animation or scene changes.
export async function auditVideo(file) {
  const probe = JSON.parse((await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=avg_frame_rate:format=duration', '-of', 'json', file
  ], { encoding: 'utf8' })).stdout);
  const rate = probe.streams[0].avg_frame_rate.split('/').map(Number);
  const fps = rate[0] / rate[1] || 25;
  const raw = (await run('ffmpeg', [
    '-v', 'error', '-i', file, '-vf', `scale=${width}:${height},format=rgb24`,
    '-f', 'rawvideo', '-'
  ], { encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 })).stdout;
  const metrics = [];
  for (let at = 0; at + pixels * 3 <= raw.length; at += pixels * 3) {
    let grey = 0;
    let right = 0;
    let bottom = 0;
    for (let p = 0; p < pixels; p++) {
      const offset = at + p * 3;
      if (raw[offset] < 126 || raw[offset] > 130 ||
          raw[offset + 1] < 126 || raw[offset + 1] > 130 ||
          raw[offset + 2] < 126 || raw[offset + 2] > 130) continue;
      grey++;
      if (p % width >= width - 3) right++;
      if (Math.floor(p / width) >= height - 3) bottom++;
    }
    metrics.push({
      frame: metrics.length,
      time: Number((metrics.length / fps).toFixed(3)),
      greyFraction: round(grey / pixels),
      rightGreyFraction: round(right / (height * 3)),
      bottomGreyFraction: round(bottom / (width * 3))
    });
  }
  const peakGreyFraction = Math.max(0, ...metrics.map(frame => frame.greyFraction));
  const minimumGreyFraction = metrics.length ? Math.min(...metrics.map(frame => frame.greyFraction)) : 0;
  const greyRange = round(peakGreyFraction - minimumGreyFraction);
  const maxEdgeGreyFraction = Math.max(0, ...metrics.map(frame =>
    Math.max(frame.rightGreyFraction, frame.bottomGreyFraction)));
  const suspiciousFrames = greyRange > 0.03 ? metrics.filter(frame =>
    frame.greyFraction > 0.04 &&
    (frame.rightGreyFraction > 0.25 || frame.bottomGreyFraction > 0.25)) : [];
  return {
    passed: metrics.length > 0 && suspiciousFrames.length === 0,
    frames: metrics.length,
    fps,
    duration: Number(probe.format.duration),
    peakGreyFraction,
    greyRange,
    maxEdgeGreyFraction,
    suspiciousFrames
  };
}

async function main() {
  const idsArgument = process.argv.find(argument => argument.startsWith('--ids='));
  const ids = idsArgument ? new Set(idsArgument.slice(6).split(',').filter(Boolean)) : undefined;
  const outputArgument = process.argv.find(argument => argument.startsWith('--output='));
  const output = path.resolve(root, outputArgument?.slice(9) || 'artifacts/video-diagnosis/stability-report.json');
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'data/catalog.json'), 'utf8'));
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'data/preview-captures.json'), 'utf8'));
  const recordings = new Map(manifest.captures.filter(capture =>
    capture.type === 'video' && capture.provenance === 'source-recording')
    .map(capture => [capture.entryId, capture]));
  const entries = catalog.filter(entry => recordings.has(entry.id) && (!ids || ids.has(entry.id)));
  const results = [];
  let next = 0;
  async function worker() {
    while (next < entries.length) {
      const entry = entries[next++];
      const video = recordings.get(entry.id).url;
      const result = { id: entry.id, title: entry.title, video };
      try {
        results.push({ ...result, ...await auditVideo(path.resolve(root, video.replace(/^\//, ''))) });
      } catch (error) {
        results.push({ ...result, passed: false, error: error.message });
      }
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  const missingIds = ids ? [...ids].filter(id => !entries.some(entry => entry.id === id)) : [];
  for (const id of missingIds) results.push({ id, passed: false, error: 'No source-recording file with this catalog ID' });
  const failed = results.filter(result => !result.passed);
  const report = { checkedAt: new Date().toISOString(), total: results.length, passed: failed.length === 0, failed, results };
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.length, output }));
  if (failed.length) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
