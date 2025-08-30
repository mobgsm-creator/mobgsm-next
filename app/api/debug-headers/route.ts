import { headers } from 'next/headers'

export async function GET() {
    const all = Object.fromEntries(headers().entries());
    return Response.json(all);
  }
  