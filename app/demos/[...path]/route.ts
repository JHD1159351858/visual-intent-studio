import { serveStaticFile } from '../../../server/static-files';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return serveStaticFile(request); }
export const HEAD = GET;
