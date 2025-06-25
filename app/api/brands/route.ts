import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: brands, error } = await supabase
      .from("shopclues")
      .select("brand")
      .not("brand", "is", null)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
    }

    // Extract unique brands
    const uniqueBrands = [...new Set(brands?.map((item) => item.brand).filter(Boolean))]

    return NextResponse.json(uniqueBrands.sort())
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
