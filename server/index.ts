import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app';
export const app = createApp();
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, '127.0.0.1', () => console.log(`Visual Intent API: http://127.0.0.1:${port}`));
}
