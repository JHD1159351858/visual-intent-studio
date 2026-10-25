import 'dotenv/config';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const dev = process.argv[2] === 'dev';
const port = process.env.DEPLOY_RUN_PORT || process.env.PORT || '5174';
const entry = path.resolve(dev ? 'node_modules/next/dist/bin/next' : '.next/standalone/server.js');
if (!existsSync(entry)) { console.error(dev ? '请先执行 npm.cmd install。' : '请先执行 npm.cmd run build。'); process.exit(1); }
const child = spawn(process.execPath, [entry, ...(dev ? ['dev', '--hostname', '127.0.0.1', '--port', port] : [])], {
  stdio: 'inherit', env: { ...process.env, PORT: port, HOSTNAME: dev ? '127.0.0.1' : process.env.HOSTNAME || '0.0.0.0' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
