
'use client'

import type { Product, ESIMProvider,BNPLProvider,reloadly } from "../lib/types"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import SortOptions from './SortOptions'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
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
}
interface ToggleTabsProps {
  onChange: (value: 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts') => void
  currentView: 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts'
}
function ToggleTabs({ onChange, currentView }: ToggleTabsProps) {

  return (
    <Tabs value={currentView} onValueChange={(val: string) => onChange(val as 'products' | 'esim' | 'bnpl'| 'reloadly-airtime' | 'reloadly-gifts')}>
      <TabsList>
        <TabsTrigger value="products">Mobiles</TabsTrigger>
        <TabsTrigger value="esim">eSIM Offers</TabsTrigger>
        <TabsTrigger value="bnpl">BNPL Offers</TabsTrigger>
        <TabsTrigger value="reloadly-airtime">Airtime Topup</TabsTrigger>
        <TabsTrigger value="reloadly-gifts">Giftcards</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
export default function ProductListing({ product, esimProviders, BNPLProvider, airtime, gifts, view, setView }: ProductListingProps) {  
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState<GroupedProduct[]>([])
  const [BNPLitems, setBNPLitems] = useState<BNPLProvider[]>([])
  const [ESIMitems, setESIMitems] = useState<ESIMProvider[]>([])
  const [Airtime, setAirtime] = useState<GroupedReloadlyProduct[]>([])
  const [Gifts, setGifts] = useState<GroupedReloadlyProduct[]>([])
  
  const currentPage = parseInt(urlSearchParams.get('page') || '1')
 
  const itemsPerPage = 20

  // Run filters and sort every time product or searchParams change
  useEffect(() => {
 
    if (view === 'products') {
    const filtered = applyFiltersAndSort(product, esimProviders!, BNPLProvider!, view, urlSearchParams)
    setFilteredProducts(filtered as GroupedProduct[]) }
    else if (view === 'esim') {
  
      const filteredESIM = applyFiltersAndSort(product, esimProviders!, BNPLProvider!, view, urlSearchParams)
      setESIMitems(filteredESIM as ESIMProvider[])
    }
    else if (view === 'bnpl') {
      const filteredBNPL = applyFiltersAndSort(product, esimProviders!, BNPLProvider!, view, urlSearchParams)
      setBNPLitems(filteredBNPL as BNPLProvider[]) }
    else if (view === 'reloadly-airtime') {
      const filteredReloadly = reloadly_group( airtime)
      setAirtime(filteredReloadly)
    } else if (view === 'reloadly-gifts') {
      const filteredReloadly = reloadly_group( gifts)
      setGifts(filteredReloadly)
    }

  }, [view, product, urlSearchParams, BNPLProvider, esimProviders, airtime, gifts])

  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [paginatedProducts, setPaginatedProducts] = useState<GroupedProduct[]>([])
  const [paginatedBNPL, setPaginatedBNPL] = useState<BNPLProvider[]>([])
  const [paginatedESIM, setPaginatedESIM] = useState<ESIMProvider[]>([])
  const [paginatedGifts, setPaginatedGifts] = useState<GroupedReloadlyProduct[]>([])
  const [paginatedAirtime, setPaginatedAirtime] = useState<GroupedReloadlyProduct[]>([])
  useEffect(() => {

    if (view === 'products') {
 
    const total = filteredProducts.length
    setTotalProducts(total)

    const pages = Math.ceil(total / itemsPerPage)
    setTotalPages(pages)

    const paginated = filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    setPaginatedProducts(paginated) }
    else if (view === 'esim') {

      const total = ESIMitems.length
      setTotalProducts(total)
      
      const pages = Math.ceil(total / itemsPerPage)
      setTotalPages(pages)

      const paginated = ESIMitems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
      setPaginatedESIM(paginated)
    }
    else if  (view === 'bnpl') {
   
      const total = BNPLitems.length
      setTotalProducts(total)
 
      const pages = Math.ceil(total / itemsPerPage)
      setTotalPages(pages)

      const paginated = BNPLitems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
      setPaginatedBNPL(paginated)
    
    }
    else if (view === 'reloadly-airtime') {
      const total = Airtime.length
      setTotalProducts(total)
      
      const pages = Math.ceil(total / itemsPerPage)
      setTotalPages(pages)

      const paginated = Airtime.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
      setPaginatedAirtime(paginated)
    }
    else if (view === 'reloadly-gifts') {
      const total = Gifts.length
      setTotalProducts(total)
      
      const pages = Math.ceil(total / itemsPerPage)
      setTotalPages(pages)

      const paginated = Gifts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
      setPaginatedGifts(paginated)
    }
  }, [filteredProducts, currentPage, view, BNPLitems, ESIMitems, Airtime,Gifts])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }
  const data =
  view === 'products'
    ? paginatedProducts
    : view === 'esim'
    ? paginatedESIM
    : view == 'bnpl'
    ? paginatedBNPL
    : view == 'reloadly-airtime'
    ? paginatedAirtime
    : paginatedGifts


  return (
    <div>
      { totalProducts > 0 ? (<>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
  <ToggleTabs currentView={view} onChange={setView} />
  
  <h2 className="hidden lg:block text-xl font-semibold text-gray-900">
    {totalProducts} Products Found
  </h2>

  {view === 'products' && <SortOptions />}
</div>


      {data.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">
      No {view === 'products' ? 'products' : view === 'esim' ? 'eSIM offers' : 'BNPL offers'} found matching your criteria.
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {view === 'products' &&
      data.map((product) => (
       
          <ProductCard key={(product as GroupedProduct).flag} product={(product as GroupedProduct).items} />
   
      ))}

    {view === 'esim' &&
      data.map((provider, index) => {
       
        return <ProductCard key={index} product={[provider as ESIMProvider]} />;
      })}

    {view === 'bnpl' &&
      data.map((provider, index) => {
  
        return (
        <ProductCard key={index} product={[provider as BNPLProvider]} />)
      })}
    {view === 'reloadly-airtime' &&
      data.map((provider, index) => {
  
        return (
        <ProductCard key={index} product={(provider as GroupedReloadlyProduct).items} />)
      })}
    {view === 'reloadly-gifts' &&
      data.map((provider, index) => {
  
        return (
        <ProductCard key={index} product={(provider as GroupedReloadlyProduct).items} />)
      })}
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
      </div></>) : <div className="flex items-center space-x-2 text-gray-600 animate-pulse">
    
    <div className="max-w-screen-lg mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <span>Coming Soon...</span>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 min-w-[200px]">
            
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ))}</div>
      </div>
  </div>}
    </div>
    
  )
}

function applyFiltersAndSort(products: Product[], esimProviders: ESIMProvider[], BNPLProvider: BNPLProvider[], view:string, urlSearchParams: URLSearchParams): GroupedProduct[] |  ESIMProvider[] | BNPLProvider[] {
  let filtered: (Product | ESIMProvider | BNPLProvider)[] = []
  if (view === "products") {
    filtered = [...products]
  } else if (view === "esim") {
    filtered = [...esimProviders]
  } else if (view === "bnpl") {
    filtered = [...BNPLProvider]
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
  
    
  

  return filtered as ESIMProvider[] | BNPLProvider[];
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
  console.log(grouped)
  return grouped
}