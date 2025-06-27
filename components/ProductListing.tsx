
'use client'

import type { Product } from "../lib/types"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import SortOptions from './SortOptions'
type GroupedProduct = {
  flag: number
  items: Product[]
}
interface ProductListingProps {
  product: Product[]
}

export default function ProductListing({ product }: ProductListingProps) {  
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const [filteredProducts, setFilteredProducts] = useState<GroupedProduct[]>([])
  
  const currentPage = parseInt(urlSearchParams.get('page') || '1')
 
  const itemsPerPage = 20

  // Run filters and sort every time product or searchParams change
  useEffect(() => {
    const filtered = applyFiltersAndSort(product, urlSearchParams)
    setFilteredProducts(filtered)
  }, [product, urlSearchParams])

  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [paginatedProducts, setPaginatedProducts] = useState<GroupedProduct[]>([])

  useEffect(() => {
    const total = filteredProducts.length
    setTotalProducts(total)

    const pages = Math.ceil(total / itemsPerPage)
    setTotalPages(pages)

    const paginated = filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    setPaginatedProducts(paginated)
  }, [filteredProducts, currentPage, itemsPerPage])
  console.log(paginatedProducts)
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {totalProducts} Products Found
        </h2>
        <SortOptions />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.flag} product={product.items} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function applyFiltersAndSort(products: Product[], urlSearchParams: URLSearchParams): GroupedProduct[] {
  let filtered = [...products]
  const searchQuery = urlSearchParams.get("search")?.toLowerCase() || ""
  if(searchQuery) {
    filtered = filtered.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery)
    )
  }
  if (urlSearchParams.getAll("brand").length > 0) {

    
    const brands = urlSearchParams.getAll("brand")
    filtered = filtered.filter((product) => brands?.includes(product.brand))
  }

  if ((urlSearchParams.getAll("minPrice") || urlSearchParams.getAll("maxPrice")).length > 0) {

    const minPrice = urlSearchParams.get("minPrice")
      ? Number.parseFloat(urlSearchParams.get("minPrice") || "0")
      : 0
    const maxPrice = urlSearchParams.get("maxPrice")
      ? Number.parseFloat(urlSearchParams.get("maxPrice") || `${Number.POSITIVE_INFINITY}`)
      : Number.POSITIVE_INFINITY

    filtered = filtered.filter((product) => {
      const price = Number.parseFloat(product.price.replace(/[₹,]/g, ""))
      return price >= minPrice && price <= maxPrice
    })
  }

  if (urlSearchParams.get("sort")) {

    switch (urlSearchParams.get("sort")) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[₹,]/g, ""))
          const priceB = Number.parseFloat(b.price.replace(/[₹,]/g, ""))
          return priceA - priceB
        })
        break
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.replace(/[₹,]/g, ""))
          const priceB = Number.parseFloat(b.price.replace(/[₹,]/g, ""))
          return priceB - priceA
        })
        break
    }
  }
  // 5. Group by `flag`
  const groupedMap = new Map<number, Product[]>()

  for (const product of filtered) {
    const flag = product.flag
    if (!groupedMap.has(flag)) {
      groupedMap.set(flag, [])
    }
    groupedMap.get(flag)!.push(product)
  }
  

  const grouped: GroupedProduct[] = Array.from(groupedMap.entries()).map(
    ([flag, items]) => ({
      flag,
      items,
    })
  )
  


  return grouped
}
