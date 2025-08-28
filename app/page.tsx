import HomePageClient from "@/components/HomePage"
import { headers } from 'next/headers'
import { getProducts, getBNPL, getESIM, getReloadlyAirtime, getReloadlyGifts, getDevices } from "../lib/supabase"
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
let cachedData: any = null;//eslint-disable-line
let lastFetch = 0;
const CACHE_DURATION = 72000 * 60 * 1000; // 2 hours
export default async function HomePage() {
  // Edge runtime request headers aren't available by default in App Router
  // So you fetch them manually with `headers()` from 'next/headers'
  const reqHeaders = headers()
  const now = Date.now();
  const country =
    reqHeaders.get('x-geo-country') ||
    reqHeaders.get('cf-ipcountry') ||
    reqHeaders.get('x-vercel-ip-country') ||
    'unknown'
  //console.log("Time since Last Fetch",now - lastFetch)
  if (!cachedData || (now - lastFetch) > CACHE_DURATION) {
    console.log("Fetching Data for Home Page");
    // Fetch all in parallel on the server
    
    const [products, bnpl, esim, airtime, giftcards, device_list] = await Promise.all([
      getProducts(country),
      getBNPL(),
      getESIM(),
      getReloadlyAirtime(),
      getReloadlyGifts(),
      getDevices(),
    ]);
  
    cachedData = { products, bnpl, esim, airtime, giftcards, device_list };
    lastFetch = now;
   
    
    
  }
  //console.log(`products count: ${cachedData!.products.length}, device count: ${device_list.length} esim count: ${esim.length}, airtime count: ${airtime.length}, giftcards count: ${giftcards.length}`);

  return (
  
    <HomePageClient
      country_code={country}
      products={cachedData!.products}
      bnpl={cachedData!.bnpl}
      esim={cachedData!.esim}
      airtime={cachedData!.airtime}
      giftcards={cachedData!.giftcards}
      device_list={cachedData!.device_list}
    />
 
  )
}
