import { createRequestHandler } from '../../../server/http-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 600;

let handler: ReturnType<typeof createRequestHandler> | undefined;
function handle(request: Request) {
  handler ??= createRequestHandler();
  return handler(request);
}

export { handle as GET, handle as HEAD, handle as POST, handle as PATCH, handle as PUT, handle as DELETE, handle as OPTIONS };
