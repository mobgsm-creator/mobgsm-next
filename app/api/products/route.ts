export const runtime = 'edge';
export const revalidate = 3600 // cache for 1 hour (optional for static rendering in RSC)

// API Route: app/listings/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@/lib/supabase" // Adjust import path as needed

export async function GET(request: NextRequest) {
  try {
    // Extract country from query parameters
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    
    if (!country) {
      return NextResponse.json({ error: "Country parameter is required" }, { status: 400 })
    }
    
    //console.log("Fetching products for country:", country)
    
    const supabase = createClient()
    const { data: products, error } = await supabase
      .from("shopclues")
      .select(`
        product_links,
        product_name,
        brand_name,
        price,
        mrp,
        discount,
        status,
        payment_options,
        img_link,
        flag,
        country, store_logo
      `)
      .eq("country", country)
    
    //console.log("Products found:", products?.length || 0)
   
    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
    
    const response = NextResponse.json(products || [])
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    
    return response
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}