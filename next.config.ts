import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  turbopack: { root: process.cwd() },
  outputFileTracingIncludes: {
    '/api/*': ['./data/catalog.seed.json', './data/design-pages.json', './data/design-components.json', './data/case-knowledge/*.json', './data/enrichment/*.json', './design-library/pages/*.html', './design-library/components/*.html'],
  },
  outputFileTracingExcludes: {
    '/*': ['./.env', './.env.*', './artifacts/**/*', './videos/**/*', './tests/**/*', './data/catalog.json', './data/selection-history.json', './data/sources-state.json', './demos/**/node_modules/**/*'],
  },
};

export default config;
