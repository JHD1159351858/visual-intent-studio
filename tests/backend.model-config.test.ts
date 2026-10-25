import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { modelFromEnvironment } from '../server/model';

beforeEach(() => {
  for (const name of ['MODEL_PROVIDER', 'MODEL_BASE_URL', 'MODEL_NAME', 'MODEL_API_KEY', 'DEEPSEEK_API_KEY', 'COZE_BASE_URL', 'COZE_API_KEY', 'COZE_BOT_ID']) vi.stubEnv(name, '');
  vi.stubEnv('COZE_API_KEY', 'old-coze-secret');
  vi.stubEnv('COZE_BOT_ID', '123');
});
afterEach(() => { vi.unstubAllEnvs(); });

describe('explicit model provider', () => {
  it('selects DeepSeek with official defaults even when Coze credentials remain configured', () => {
    vi.stubEnv('MODEL_PROVIDER', 'deepseek'); vi.stubEnv('MODEL_API_KEY', 'new-deepseek-secret');
    expect(modelFromEnvironment()).toEqual({ provider: 'deepseek', baseUrl: 'https://api.deepseek.com', name: 'deepseek-flash', apiKey: 'new-deepseek-secret' });
  });
  it('does not fall back to Coze when DeepSeek was selected but its key is missing', () => {
    vi.stubEnv('MODEL_PROVIDER', 'deepseek');
    expect(modelFromEnvironment()).toBeNull();
  });
  it('uses an existing DEEPSEEK_API_KEY and respects explicit endpoint and model settings', () => {
    vi.stubEnv('MODEL_PROVIDER', 'deepseek'); vi.stubEnv('DEEPSEEK_API_KEY', 'existing-secret');
    vi.stubEnv('MODEL_BASE_URL', 'https://deepseek.example/v1'); vi.stubEnv('MODEL_NAME', 'chosen-model');
    expect(modelFromEnvironment()).toEqual({ provider: 'deepseek', baseUrl: 'https://deepseek.example/v1', name: 'chosen-model', apiKey: 'existing-secret' });
  });
  it('can explicitly choose the compatible endpoint without Coze taking precedence', () => {
    vi.stubEnv('MODEL_PROVIDER', 'compatible'); vi.stubEnv('MODEL_BASE_URL', 'https://compatible.test/v1');
    vi.stubEnv('MODEL_NAME', 'model'); vi.stubEnv('MODEL_API_KEY', 'compatible-secret');
    expect(modelFromEnvironment()).toEqual({ baseUrl: 'https://compatible.test/v1', name: 'model', apiKey: 'compatible-secret' });
  });
});
