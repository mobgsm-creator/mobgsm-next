import HomePageClient from "@/components/HomePage"
import { headers } from 'next/headers'
import { getProducts, getBNPL, getESIM, getReloadlyAirtime, getReloadlyGifts, getDevices } from "../lib/supabase"
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
  console.time("fetchAllData");
  // Fetch all in parallel on the server
  const [products, bnpl, esim, airtime, giftcards, device_list] =
    await Promise.all([
      getProducts(country),
      getBNPL(),
      getESIM(),
      getReloadlyAirtime(),
      getReloadlyGifts(),
      getDevices(),
    ])
  console.timeEnd("fetchAllData");
  return (
  
    <HomePageClient
      country_code={country}
      products={products}
      bnpl={bnpl}
      esim={esim}
      airtime={airtime}
      giftcards={giftcards}
      device_list={device_list}
    />
 
  )
}
