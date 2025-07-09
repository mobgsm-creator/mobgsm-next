import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
export const runtime = 'edge';
export const revalidate = 3600 // cache for 1 hour (optional for static rendering in RSC)

export async function GET() {
  try {

    const supabase = createClient()

    const { data: products, error } = await supabase
      .from("bnpl")
      .select(`
        Name,
        Website,
        Credit_Limit,
        Interest_Rate,
        KYC,
        NBFC_Partner,
        Image_URL, country
       
      
      `)
    
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
