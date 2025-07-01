import { getProducts, getBNPL, getESIM } from "../lib/supabase"
import  Image  from "next/image"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
export default async function HomePage() {
  const products = await getProducts()
 
  const bnpl = await getBNPL()

  const esim = await getESIM()
 

 
  return (
    
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
       
  <Image 
    src='/MOB GSM svg vector.svg' 
    alt='' 
    width={40} 
    height={40} 
  />
</div>

      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductSectionWrapper
          product={products}
          esimProviders={esim}
          BNPLProvider={bnpl}/>
      </div>
    </div>
  )
}

