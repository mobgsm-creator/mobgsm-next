'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
import CountrySelector from "@/components/CountrySelector"
//import type { Product, BNPLProvider, ESIMProvider } from "../lib/types"


export default function HomePageClient({ country_code }: { country_code: string }) {
  //console.log(country_code)
  const [country, setCountry] = useState(country_code)

  // Load initial country from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedCountry")
    if (stored) setCountry(stored)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
          <Image src="/MOBGSM-svg-vector.svg" alt="" width={40} height={40} />
          <div className="absolute top-3 right-4">
            <CountrySelector country={country} setCountry={setCountry} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductSectionWrapper
          country={country}
        
          
        />
      </div>
    </div>
  )
}
