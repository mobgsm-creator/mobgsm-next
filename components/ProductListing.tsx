
'use client'
import dynamic from 'next/dynamic'
import type { Product, ESIMProvider,BNPLProvider,reloadly } from "../lib/types"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Session } from 'next-auth'
type TabData =
  | GroupedProduct[]
  | BNPLProvider[]
  | ESIMProvider[]
  | GroupedReloadlyProduct[]
type GroupedProduct = {
  flag: number
  items: Product[]
}
type GroupedReloadlyProduct = {
  flag: string
  items: reloadly[]
}
interface ProductListingProps {
  product: Product[]
  esimProviders?: ESIMProvider[]
  BNPLProvider?: BNPLProvider[]
  airtime: reloadly[],
  gifts: reloadly[],
  view: 'products' | 'esim' | 'bnpl' | 'reloadly-airtime' | 'reloadly-gifts'
  setView: (view: 'products' | 'esim' | 'bnpl' | 'reloadly-airtime' | 'reloadly-gifts') => void
  session: Session | null
}
interface ToggleTabsProps {
  onChange: (value: 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts') => void
  currentView: 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts'
}
function ToggleTabs({ onChange, currentView }: ToggleTabsProps) {
  const router = useRouter()
  // useEffect(() => {
  //   //console.log("ToggleTabs called with currentView:", currentView);
  // }, [currentView]);
  return (
    
    <Tabs value={currentView} onValueChange={(val: string) => {onChange(val as 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts'); router.replace(window.location.pathname)}}>
      <TabsList className = 'flex flex-wrap'>
        
        <TabsTrigger value="reloadly-airtime">Airtime Topup</TabsTrigger>
        <TabsTrigger value="reloadly-gifts">Giftcards</TabsTrigger>
        <TabsTrigger value="products"><span className="flex items-center gap-2">Mobiles<sup className="text-[0.4rem] align-super"><span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
      BETA
    </span></sup>
  </span></TabsTrigger>
        <TabsTrigger value="esim"><span className="flex items-center gap-2">eSIM Offers<sup className="text-[0.4rem] align-super"><span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
      BETA
    </span></sup>
  </span></TabsTrigger>
        <TabsTrigger value="bnpl">
  <span className="flex items-center gap-2">
    BNPL Offers
    <sup className="text-[0.4rem] align-super"><span className="font-semibold text-white bg-purple-500 px-2 py-0.5 rounded">
      BETA
    </span></sup>
  </span>
</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
const LazyProductCard = dynamic(() => import('./ProductCard'), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
  ),
  ssr: false
})

export default function ProductListing({ product, esimProviders, BNPLProvider, airtime, gifts, view, setView, session }: ProductListingProps) {  
  
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [filteredData, setFilteredData] = useState<TabData>([])
  
  const currentPage = parseInt(urlSearchParams.get('page') || '1')
 
  const itemsPerPage = 20

  // Run filters and sort every time product or searchParams change
  useEffect(() => {
    const filtered = applyFiltersAndSort(
      product,
      esimProviders!,
      BNPLProvider!,
      airtime,
      gifts,
      view,
      urlSearchParams
    )
    setFilteredData(filtered)
    //setCurrentPage(1) // reset page when switching tab/filter
  }, [product, esimProviders, BNPLProvider, airtime, gifts, view, urlSearchParams])

  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [paginatedData, setPaginatedData] = useState<TabData>([])

  // Step 2: Pagination
  useEffect(() => {
    const total = filteredData.length
    setTotalProducts(total)

    const pages = Math.ceil(total / itemsPerPage) || 1
    setTotalPages(pages)

    const paginated = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    setPaginatedData(paginated)
  }, [filteredData, currentPage])

  


  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }
  const data = paginatedData
 
  //console.log("Logging Data length:", view,data.length);
 
  function getProductsForCard(item: GroupedProduct | ESIMProvider | BNPLProvider | GroupedReloadlyProduct, view : string,) {
    switch(view) {
      case 'products':
        return (item as GroupedProduct).items;
      case 'esim':
        return [item as ESIMProvider];
      case 'bnpl':
        return [item as BNPLProvider];
      case 'reloadly-airtime':
      case 'reloadly-gifts':
        return (item as GroupedReloadlyProduct).items;
      default:
        return [];
    }
  }
  

  return (
    <div>
      <>
      <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-4 mb-6">
  <ToggleTabs currentView={view} onChange={setView} />

  <h2
    className="inline-flex justify-center items-center mt-4 lg:mt-0 text-xs font-semibold text-blue-700 border border-blue-500 rounded-md px-2 py-1 bg-blue-50"
  >
    {totalProducts > 0 ? `${totalProducts} Products Found` : "No Products Found"}
  </h2>
</div>


    
      {totalProducts > 0 && data.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">
      No {view === 'products' ? 'products' : view === 'esim' ? 'eSIM offers' : 'BNPL offers'} found matching your criteria.
    </p>
  </div>
) : (
  
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {data.map((item, index) => {
    // First 2 products load immediately
    if (index < 2) {
      return (
        <ProductCard
          key={index}
          product={getProductsForCard(item, view)}
          session={session}
        />
      )
    }
    
    // Rest load lazily
    return (
      <LazyProductCard
        key={index}
        product={getProductsForCard(item, view)}
        session={session}
      />
    )
  })}
</div>
)}



<div className={`${totalProducts > 0 ? '' : 'hidden'} flex justify-center mt-8 space-x-4`}>

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
      </div></> <div className="flex items-center space-x-2 text-gray-600 animate-pulse">
    
    <div className="max-w-screen-lg mx-auto px-4">
    
      </div>
  </div>
    </div>
    
  )
}

function applyFiltersAndSort(products: Product[], esimProviders: ESIMProvider[], BNPLProvider: BNPLProvider[],airtime: reloadly[],
  gifts: reloadly[], view:string, urlSearchParams: URLSearchParams): GroupedProduct[] |  ESIMProvider[] | BNPLProvider[] | GroupedReloadlyProduct[]  {
  let filtered: (Product | ESIMProvider | BNPLProvider | reloadly)[] = []
  if (view === "products") {
    filtered = [...products]
  } else if (view === "esim") {
    filtered = [...esimProviders]
  } else if (view === "bnpl") {
    filtered = [...BNPLProvider]
  } else if (view === "reloadly-airtime") {
    filtered = [...airtime]
  } else if (view === "reloadly-gifts") {
    filtered = [...gifts]
  }
  const searchQuery = urlSearchParams.get("search")?.toLowerCase() || ""
  if (searchQuery) {
    filtered = filtered.filter((item) => {
      if ("product_name" in item && item.product_name?.toLowerCase().includes(searchQuery)) {
        return true
      }
      if ("provider" in item && item.provider?.toLowerCase().includes(searchQuery)) {
        return true
      }
      if ("Name" in item && item.Name?.toLowerCase().includes(searchQuery)) {
        return true
      }
      if ("operator" in item && item.operator?.toLowerCase().includes(searchQuery)) {
        return true
      }
      return false
    })
  }
  if (urlSearchParams.getAll("brand").length > 0) {
    const brands = urlSearchParams.getAll("brand")
  
    filtered = filtered.filter((item) => {
      if (view === "products" && "brand_name" in item) {
        return brands.includes(item.brand_name)
      }
      if (view === "esim" && "provider" in item) {
        return brands.includes(item.provider)
      }
      if (view === "bnpl" && "Name" in item) {
        return brands.includes(item.Name)
      }
      if (view === "reloadly-airtime" && "operator" in item) {
        return brands.includes(item.operator)
      }
      if (view === "reloadly-gifts" && "operator" in item) {
        return brands.includes(item.operator)
      }
      return false
    })
  }
  
  if (view === 'products') {

    let productList = filtered as Product[]

    if ((urlSearchParams.getAll("minPrice") || urlSearchParams.getAll("maxPrice")).length > 0) {

      const minPrice = urlSearchParams.get("minPrice")
        ? Number.parseFloat(urlSearchParams.get("minPrice") || "0")
        : 0
      const maxPrice = urlSearchParams.get("maxPrice")
        ? Number.parseFloat(urlSearchParams.get("maxPrice") || `${Number.POSITIVE_INFINITY}`)
        : Number.POSITIVE_INFINITY

      productList = productList.filter((product) => {
        const price = Number.parseFloat(product.price.replace(/[₹,]/g, ""))
        return price >= minPrice && price <= maxPrice
      })
    }

    if (urlSearchParams.get("sort")) {

      switch (urlSearchParams.get("sort")) {
        case "price-low":
          productList.sort((a, b) => {
            const priceA = Number.parseFloat(a.price.replace(/[₹,]/g, ""))
            const priceB = Number.parseFloat(b.price.replace(/[₹,]/g, ""))
            return priceA - priceB
          })
          break
        case "price-high":
          productList.sort((a, b) => {
            const priceA = Number.parseFloat(a.price.replace(/[₹,]/g, ""))
            const priceB = Number.parseFloat(b.price.replace(/[₹,]/g, ""))
            return priceB - priceA
          })
          break
      }
    }
    // 5. Group by `flag`
    const groupedMap = new Map<number, Product[]>()

    for (const product of productList) {
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
  if (view === 'reloadly-airtime' || view === 'reloadly-gifts') {

  // 5. Group by `flag`
    const grouped = reloadly_group(filtered as reloadly[])
  
  return grouped
  }
    
  

  return filtered as ESIMProvider[] | BNPLProvider[] | GroupedReloadlyProduct[] ;
}
function reloadly_group(item_list : reloadly[]): GroupedReloadlyProduct[] {
  const groupedMap = new Map<string, reloadly[]>()

  for (const product of item_list) {
    const flag = product.flag
    if (!groupedMap.has(flag)) {
      groupedMap.set(flag, [])
    }
    groupedMap.get(flag)!.push(product)
  }
  

  const grouped: GroupedReloadlyProduct[] = Array.from(groupedMap.entries()).map(
    ([flag, items]) => ({
      flag,
      items,
    })
  )
  //console.log(grouped)
  return grouped
}