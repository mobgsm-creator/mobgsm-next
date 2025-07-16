import HomePageClient from "@/components/HomePage"
import { headers } from 'next/headers'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Edge runtime request headers aren't available by default in App Router
  // So you fetch them manually with `headers()` from 'next/headers'
  const reqHeaders = headers()
  
  const country =
    reqHeaders.get('x-geo-country') ||
    reqHeaders.get('cf-ipcountry') ||
    reqHeaders.get('x-vercel-ip-country') ||
    'unknown'

  return (
  
    <HomePageClient country_code={country} />
 
  )
}
