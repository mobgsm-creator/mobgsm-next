'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
import CountrySelector from "@/components/CountrySelector"
import type { Product, BNPLProvider, ESIMProvider, Device, reloadly } from "../lib/types"
import Link from "next/link"
type HomePageProps = {
  country_code: string
  products: Product[]
  bnpl: BNPLProvider[]
  esim: ESIMProvider[]
  airtime: reloadly[]
  giftcards: reloadly[]
  device_list: Device[]
}

export default function HomePageClient({
  country_code,
  products,
  bnpl,
  esim,
  airtime,
  giftcards,
  device_list
}: HomePageProps) {
  if (country_code === "unknown")
    { 
      country_code = "ae"
    }
  const [country, setCountry] = useState(country_code || "")

  // Load initial country from localStorage
  useEffect(() => {
    
   
    const stored = localStorage.getItem("selectedCountry")
    if (stored) setCountry(stored)
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <Link  href={`https://${country ? country + "." : ""}mobgsm.com`}>
        <Image
          src="/MOBGSM-svg-vector.svg"
          alt="MOBGSM Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>
    </div>
          <div className="absolute top-3 right-4">
            <CountrySelector country={country} setCountry={setCountry} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductSectionWrapper
          country={country}
          products={products}
          bnpl={bnpl}
          esim={esim}
          airtime={airtime}
          giftcards={giftcards}
          device_list={device_list}
        
          
        />
      </div>
    </div>
  )
}
