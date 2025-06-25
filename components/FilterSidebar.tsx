"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "../components/ui/slider"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50000])
  

  useEffect(() => {
    // Fetch available brands
    fetchBrands()

    // Initialize filters from URL params
    const brandParam = searchParams.getAll("brand")
    if (brandParam) {
      setSelectedBrands(brandParam)
    }

    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice || maxPrice) {
      setPriceRange([minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 50000])
    }

    
  }, [searchParams])

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands")
      const data: unknown = await response.json()

      // Ensure we only set an array; otherwise reset to an empty array
      if (Array.isArray(data)) {
        setBrands(data as string[])
      } else {
        console.error("Unexpected brands payload:", data)
        setBrands([])
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      setBrands([]) // Fail gracefully
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedBrands.length > 0) {
      selectedBrands.forEach((brand) => params.append("brand", brand))
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    }

    if (priceRange[1] < 50000) {
      params.set("maxPrice", priceRange[1].toString())
    }

    

    // Preserve existing sort parameter
    const currentSort = searchParams.get("sort")
    if (currentSort) {
      params.set("sort", currentSort)
    }

    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setPriceRange([0, 50000])
    

    const params = new URLSearchParams()
    const currentSort = searchParams.get("sort")
    if (currentSort) {
      params.set("sort", currentSort)
    }

    router.push(`/?${params.toString()}`)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Filter */}
        <div>
          <h3 className="font-medium mb-3">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <label
                    htmlFor={brand}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No brands found.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider value={priceRange} onValueChange={setPriceRange} max={50000} min={0} step={500} className="mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

       

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
