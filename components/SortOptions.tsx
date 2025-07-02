"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function SortOptions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "default"

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select sorting" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
      
        </SelectContent>
      </Select>
    </div>
  )
}
