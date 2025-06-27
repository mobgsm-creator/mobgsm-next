import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const revalidate = 3600 // cache for 1 hour (optional for static rendering in RSC)

export async function GET() {
  try {
    const supabase = createClient()

    const { data: products, error } = await supabase
      .from("shopclues")
      .select(`
        product_links,
        product_name,
        brand,
        price,
        mrp,
        discount,
        status,
        payment_options,
        rating,
        img_link, flag
      `)
      .range(0, 1999)
   
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    const response = NextResponse.json(products || [])

    // ✅ Set HTTP cache headers
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60")

    return response
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
