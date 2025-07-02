'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import ProductSectionWrapper from "@/components/ProductAndFilterSection"
import CountrySelector from "@/components/CountrySelector"
import type { Product, BNPLProvider, ESIMProvider } from "../lib/types"

interface Props {
  products: Product[]
  bnpl: BNPLProvider[]
  esim: ESIMProvider[]
}

export default function HomePageClient({ products, bnpl, esim }: Props) {
  const [country, setCountry] = useState("IN")

  // Load initial country from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedCountry")
    if (stored) setCountry(stored)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
          <Image src="/MOB GSM svg vector.svg" alt="" width={40} height={40} />
          <div className="absolute top-3 right-0">
            <CountrySelector country={country} setCountry={setCountry} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProductSectionWrapper
          country={country}
          product={products}
          esimProviders={esim}
          BNPLProvider={bnpl}
          
        />
      </div>
    </div>
  )
}
