import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cloudflare headers
  const cfCountry = request.headers.get('cf-ipcountry')
  const cfCity = request.headers.get('cf-ipcity')
  const cfRegion = request.headers.get('cf-ipregion')

  // Vercel headers
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  const vercelRegion = request.headers.get('x-vercel-ip-region')
  const vercelCity = request.headers.get('x-vercel-ip-city')

  const country = cfCountry || vercelCountry || 'unknown'
  const region = cfRegion || vercelRegion || 'unknown'
  const city = cfCity || vercelCity || 'unknown'

  const response = NextResponse.next()
  response.headers.set('x-geo-country', country)
  response.headers.set('x-geo-region', region)
  response.headers.set('x-geo-city', city)
 

  return response
}
