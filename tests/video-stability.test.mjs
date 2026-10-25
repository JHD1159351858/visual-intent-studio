import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

test('rejects the real recording containing screenshot-induced grey padding', async () => {
  const { auditVideo } = await import('../scripts/check-video-stability.mjs');
  const result = await auditVideo(path.resolve('tests/fixtures/capture-with-screenshot.webm'));
  assert.equal(result.passed, false);
  assert.ok(result.frames > 0);
  assert.ok(result.peakGreyFraction > 0.04);
  assert.ok(result.greyRange > 0.03);
  assert.ok(result.maxEdgeGreyFraction > 0.25);
  assert.ok(result.suspiciousFrames.length > 0);
});

test('accepts the same real demo recorded without screenshots', async () => {
  const { auditVideo } = await import('../scripts/check-video-stability.mjs');
  const result = await auditVideo(path.resolve('tests/fixtures/capture-without-screenshot.webm'));
  assert.equal(result.passed, true);
  assert.ok(result.frames > 0);
  assert.equal(result.suspiciousFrames.length, 0);
});

test('checks a two-frame clip without rejecting a normal full-frame color change', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'video-stability-'));
  try {
    const file = path.join(directory, 'two-frames.webm');
    await promisify(execFile)('ffmpeg', [
      '-v', 'error', '-f', 'lavfi', '-i', 'color=black:s=96x60:r=25:d=0.04',
      '-f', 'lavfi', '-i', 'color=white:s=96x60:r=25:d=0.04',
      '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0',
      '-c:v', 'libvpx', '-an', '-y', file
    ]);
    const { auditVideo } = await import('../scripts/check-video-stability.mjs');
    const result = await auditVideo(file);
    assert.equal(result.frames, 2);
    assert.equal(result.passed, true);
    assert.equal(result.suspiciousFrames.length, 0);
  } finally {
    await fs.rm(path.join(directory, 'two-frames.webm'), { force: true });
    await fs.rmdir(directory);
  }
});
