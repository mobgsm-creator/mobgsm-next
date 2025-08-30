import HomePageClient from "@/components/HomePage"
import { headers } from 'next/headers'
import { getProducts, getBNPL, getESIM, getReloadlyAirtime, getReloadlyGifts, getDevices } from "../lib/supabase"
//export const runtime = 'edge'
export const dynamic = 'force-dynamic'
let cachedData: any = null;//eslint-disable-line
let lastFetch = 0;
const CACHE_DURATION = 72000 * 60 * 1000; // 2 hours
export default async function HomePage() {
  // Edge runtime request headers aren't available by default in App Router
  // So you fetch them manually with `headers()` from 'next/headers'
  const reqHeaders = headers()
  const host =
  reqHeaders.get("x-forwarded-host") ||
  reqHeaders.get("host") ||
  "";
  // Split hostname by dots
  const parts = host.split(".");
  // If it has a subdomain (like "in.mobgsm.com"), take the first part
  // If it's just "mobgsm.com", then no country subdomain exists
  let country_domain: string | null = null;
  if (parts[0].length === 2) {
    country_domain = parts[0]; // "in" from "in.mobgsm.com"
  }
  console.log(country_domain)
  const now = Date.now();
  const country = country_domain ||
    reqHeaders.get('x-geo-country') ||
    reqHeaders.get('cf-ipcountry') ||
    'unknown'
  console.log("Detected Country:", country);
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
  console.log(`products count: ${cachedData!.products.length}, device count: ${cachedData.device_list.length} esim count: ${cachedData.esim.length}, airtime count: ${cachedData.airtime.length}, giftcards count: ${cachedData.giftcards.length}`);

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
