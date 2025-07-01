'use client'

import { useState } from "react"
import ProductListing from "./ProductListing"
import FilterSidebar from "./FilterSidebar"
import { Skeleton } from "../components/ui/skeleton"
import type { Product, ESIMProvider,BNPLProvider } from "../lib/types"
import { Suspense } from "react"
interface ProductListingProps {
    product: Product[]
    esimProviders?: ESIMProvider[]
    BNPLProvider?: BNPLProvider[]
  }
export default function ProductSectionWrapper({ product, esimProviders, BNPLProvider } : ProductListingProps) {
  const [view, setView] = useState<'products' | 'esim' | 'bnpl'>('products')
 
  return (
    <div className="flex gap-6">
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <FilterSidebar product={product}
                esimProviders={esimProviders} 
                BNPLProvider={BNPLProvider} 
                 view={view}/>
              </Suspense>
        </div>
      </div>
      <div className="flex-1 min-w-0">
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListing 
          product={product} 
          esimProviders={esimProviders} 
          BNPLProvider={BNPLProvider} 
          view={view}
          setView={setView}
        />
        </Suspense>
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
  