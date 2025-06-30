import { Suspense } from "react"
import ProductListing from "../components/ProductListing"
import FilterSidebar from "../components/FilterSidebar"
import { Skeleton } from "../components/ui/skeleton"
import { getProducts, getBNPL, getESIM } from "../lib/supabase"
import  Image  from "next/image"
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
        <div className="flex gap-6">
          {/* Sticky Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <FilterSidebar product={products}/>
              </Suspense>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductListingSkeleton />}>
            <ProductListing 
              product={products} 
              esimProviders={esim} 
              BNPLProvider={bnpl} 
            />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductListingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      ))}
    </div>
  )
}
