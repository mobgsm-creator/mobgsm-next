import { getProducts, getBNPL, getESIM } from "../lib/supabase"
import HomePageClient from "@/components/HomePage"
export const runtime = 'edge';
export default async function HomePage() {
  const products = await getProducts()
  
  const bnpl = await getBNPL()

  const esim = await getESIM()
  
 

 
  return (
    
    <HomePageClient
      products={products}
      bnpl={bnpl}
      esim={esim}
    />
  )
}

